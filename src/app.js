const productChoosen = document.querySelector("#choose-product .container");
const nomorKlikKeranjang = document.querySelector(".klik-keranjang .nomor");
let lastIndex = "";
let lastClass = "";
const totalSemuaHargaElement = document.querySelector("#harga-total .nominal");
let totalSemuaHarga = 0;
const categoryButtons = document.querySelectorAll(
  ".categories-container button"
);
const klikFilter = document.querySelector(".filter");
const allProductChoosen = document.querySelectorAll(
  "#choose-product .container #product"
);
const allProductNOTChoosen = document.querySelectorAll(
  "#container-product #product"
);

function capitalizeFirstLetter(sentence) {
  return sentence
    .split(" ") // Pecah kalimat menjadi array kata-kata
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Kapitalisasi huruf pertama dan ubah sisanya menjadi huruf kecil
    .join(" "); // Gabungkan kembali menjadi kalimat
}

let iNomor = 0;
const handleClick = (event) => {
  const product = event.target.closest("#product"); // Pastikan elemen yang diklik adalah produk

  product.classList.toggle("klik");

  const warningPilihanKosong = Array.from(
    document.querySelector("#choose-product").children
  )[1];

  if (product.classList.contains("klik")) {
    iNomor++;

    lastIndex = Array.from(product.classList).length - 2;
    lastClass = Array.from(product.classList)[lastIndex];

    const total = document.querySelector("#total");
    const isi = document.querySelector(
      `.${lastClass} .content .description .text i`
    );
    total.innerHTML += `
    <div class="jmlh ${lastClass}">
      <div class="detail">
        <p>${product.className.replace(/\bproduk\d*\b|\bklik\b/g, "")} (${
      isi.textContent
    })</p>
        <input type="number" id="jumlah" class="inpjmlh ${lastClass}" value=1>
      </div>
      <p class="nominal">Total: </p>
    </div>
    `;

    productChoosen.appendChild(document.querySelector(`.${lastClass}`));

    warningPilihanKosong.innerHTML = "";

    // Simpan ke local storage
    const inputJumlah = document.querySelector(`.inpjmlh.${lastClass}`);
    sessionStorage.setItem(lastClass, inputJumlah.value);

    // Tambahkan listener untuk perhitungan total langsung
    const jumlahInput = document.querySelector(`.inpjmlh.${lastClass}`);
    jumlahInput.addEventListener("change", function () {
      if (jumlahInput.value.trim() === "") {
        jumlahInput.value = 0;
      } else if (jumlahInput.value < 1) {
        jumlahInput.value = 1;
      }

      // Ambil harga dari elemen terkait
      const harga = document.querySelector(
        `.${lastClass} .content .description .text p i`
      ).className;
      const intHarga = Number(harga);

      // Hitung total
      const totalHarga = intHarga * jumlahInput.value;

      // Format dan update total per barang
      const hargaTotalIDN = new Intl.NumberFormat("id-ID").format(totalHarga);
      const totalPerBarang = document.querySelector(
        `.jmlh.${lastClass} .nominal`
      );
      totalPerBarang.textContent = `Total: Rp${hargaTotalIDN}`;

      // Simpan perubahan ke local storage
      sessionStorage.setItem(lastClass, jumlahInput.value);
    });

    // Ambil harga produk
    const harga = document.querySelector(
      `.${lastClass} .content .description .text p i`
    ).className;
    const intHarga = Number(harga);

    // Hitung total harga per barang
    const totalHarga = intHarga * 1; // Default jumlah = 1
    const hargaTotalIDN = new Intl.NumberFormat("id-ID").format(totalHarga);
    document.querySelector(
      `.jmlh.${lastClass} .nominal`
    ).textContent = `Total: Rp${hargaTotalIDN}`;

    // Simpan ke local storage
    sessionStorage.setItem(lastClass, 1);

    const semuaTotalPerBarang = document.querySelectorAll(".jmlh .nominal");
    // Hitung total semua harga
    semuaTotalPerBarang.forEach((totalBarang) => {
      const totalText = totalBarang.textContent.replace(/[^\d]/g, ""); // Ambil angka saja
      totalSemuaHarga += Number(totalText);
    });

    // Tampilkan total semua harga
    const totalSemuaHargaIDN = new Intl.NumberFormat("id-ID").format(
      totalSemuaHarga
    );
    totalSemuaHargaElement.textContent = totalSemuaHargaIDN;

    // Muat nilai dari local storage jika ada
    const storedValue = sessionStorage.getItem(lastClass);
    if (storedValue !== null) {
      jumlahInput.value = storedValue;

      // Perbarui total sesuai nilai tersimpan
      const intHarga = Number(
        document.querySelector(`.${lastClass} .content .description .text p i`)
          .className
      );
      const storedTotal = intHarga * storedValue;
      const storedTotalFormatted = new Intl.NumberFormat("id-ID").format(
        storedTotal
      );
      document.querySelector(
        `.jmlh.${lastClass} .nominal`
      ).textContent = `Total: Rp${storedTotalFormatted}`;
    }

    const inputs = document.querySelectorAll("#jumlah");
    inputs.forEach((input) => {
      let inputKey = input.classList[1];
      let storedValue = sessionStorage.getItem(inputKey);

      if (storedValue !== null) {
        input.value = storedValue;
      }
    });
  } else {
    iNomor--;
    lastIndex = Array.from(product.classList).length - 1;
    lastClass = Array.from(product.classList)[lastIndex];

    // Hapus elemen terkait dari DOM
    let inputToRemove = document.querySelector(`.jmlh.${lastClass}`);
    if (inputToRemove) {
      // Ambil nilai total yang akan dihapus
      const totalText = inputToRemove
        .querySelector(".nominal")
        .textContent.replace(/\D/g, "");
      const totalToRemove = Number(totalText);

      // Kurangi dari total semua harga
      let currentTotal = Number(
        totalSemuaHargaElement.textContent.replace(/\D/g, "")
      );
      currentTotal -= totalToRemove;

      // Perbarui tampilan total semua harga
      const updatedTotalIDN = new Intl.NumberFormat("id-ID").format(
        currentTotal
      );
      totalSemuaHargaElement.textContent = updatedTotalIDN;

      document
        .querySelector("#container-product")
        .appendChild(document.querySelector(`.${lastClass}`));

      // Hapus elemen dari DOM
      inputToRemove.remove();

      if (productChoosen.innerHTML === "") {
        warningPilihanKosong.innerHTML = "Tidak ada produk yang dipilih";
      }
    }
  }
  nomorKlikKeranjang.textContent = iNomor;
  if (iNomor === 0) {
    nomorKlikKeranjang.style.display = "none";
    document.querySelector(".klik-keranjang").classList.remove("up");
  } else {
    nomorKlikKeranjang.style.display = "block";
    document.querySelector(".klik-keranjang").classList.add("up");
  }

  const inputJumlah = document.querySelectorAll("#jumlah");
  inputJumlah.forEach((inpjmlh) => {
    inpjmlh.addEventListener("change", function () {
      let inputJmlh = document.querySelector(
        `.inpjmlh.${inpjmlh.classList[1]}`
      );

      let totalHarga = 0;
      let lastClass = inputJmlh.classList[1];

      if (inputJmlh.value.trim() === "") {
        inputJmlh.value = 0;
      } else if (inputJmlh.value < 1) {
        inputJmlh.value = 1;
      }

      const harga = document.querySelector(
        `.${inputJmlh.classList[1]} .content .description .text p i`
      ).className;
      const intHarga = Number(harga);
      totalHarga += intHarga * inputJmlh.value;

      let totalPerBarang = document.querySelector(
        `.jmlh.${lastClass} .nominal`
      );
      let hargaTotalIDN = new Intl.NumberFormat("id-ID").format(totalHarga);
      totalPerBarang.textContent = `Total: Rp${hargaTotalIDN}`;

      const semuaTotalPerBarang = document.querySelectorAll(".jmlh .nominal");
      // Hitung total semua harga
      semuaTotalPerBarang.forEach((totalBarang) => {
        const totalText = totalBarang.textContent.replace(/\D/g, ""); // Ambil angka saja
        totalSemuaHarga += Number(totalText);
      });

      // Tampilkan total semua harga
      const totalSemuaHargaIDN = new Intl.NumberFormat("id-ID").format(
        totalSemuaHarga
      );
      totalSemuaHargaElement.textContent = totalSemuaHargaIDN;

      // Update nilai di local storage
      sessionStorage.setItem(lastClass, inputJmlh.value);
    });
  });
};

// Fungsi untuk menampilkan item
function displayItems(items) {
  const containerProduct = document.getElementById("container-product");
  containerProduct.innerHTML = ""; // Clear previous results

  items.forEach((item) => {
    const product = document.createElement("div");
    product.id = "product";

    let hargaIDN = new Intl.NumberFormat("id-ID").format(item.harga);

    product.innerHTML = `
    <div class="content ${item.kategori}">
      <div class="img">
        <img src="/img/gambar-${item.gambar}" alt="${item.nama}" />
      </div>
      <div class="description">
        <div class="text">
          <h3>${capitalizeFirstLetter(item.nama)}</h3>
          <i>${capitalizeFirstLetter(item.isi)}</i>
          <p>Rp<i class="${item.harga}">${hargaIDN}</i></p>
        </div>
      </div>
    </div>
    `;
    product.className = `${capitalizeFirstLetter(item.nama)}`;
    product.classList.add(`produk${item.iProduct}`);
    containerProduct.appendChild(product);
    product.addEventListener("click", handleClick);
  });
}

const mustRemoveProduct = () => {
  allProductChoosen.forEach((productChoosen) => {
    lastIndex = Array.from(productChoosen.classList).length - 2;
    lastClassChoosen = Array.from(productChoosen.classList)[lastIndex];
    allProductNOTChoosen.forEach((product) => {
      lastClass = Array.from(product.classList).pop();
      if (lastClassChoosen === lastClass) {
        const productMustRemove = document.querySelector(
          `#container-product #${product.id}.${lastClass}`
        );
        productMustRemove.remove();
      }
    });
  });
};

// Fungsi untuk memfilter barang berdasarkan kategori
function filterByCategory(category) {
  fetch("http://localhost:3000/data")
    .then((response) => response.json())
    .then((data) => {
      let filteredItems = [];

      if (category === "semua") {
        filteredItems = data; // Menampilkan semua barang
      } else {
        filteredItems = data.filter((item) => item.kategori === category); // Filter berdasarkan kategori
      }

      displayItems(filteredItems); // Menampilkan barang yang sudah difilter

      mustRemoveProduct();
    })
    .catch((error) => console.error("Error:", error));
}

// Fungsi untuk memfilter barang berdasarkan kategori
function searchByName(inputNama) {
  fetch("http://localhost:3000/data")
    .then((response) => response.json())
    .then((data) => {
      let filteredItems = [];

      filteredItems = data.filter((item) => item.nama.includes(inputNama)); // Filter berdasarkan kategori

      displayItems(filteredItems); // Menampilkan barang yang sudah difilter

      mustRemoveProduct();
    })
    .catch((error) => console.error("Error:", error));
}

async function fetchData() {
  const response = await fetch("http://localhost:3000/data");
  const data = await response.json();

  const container = document.getElementById("container-product");
  container.innerHTML = "";

  displayItems(data);

  // Tambahkan event listener untuk kategori filter
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.id;
      filterByCategory(category);
    });
  });

  const products = document.querySelectorAll("#product");
  products.forEach((product) => {
    product.addEventListener("click", handleClick);
  });
}

document
  .querySelector(".klik-keranjang")
  .addEventListener("click", function () {
    document.querySelector(".keranjang-belanja").classList.toggle("klik");
    document.querySelector(".klik-keranjang i").classList.toggle("bx-x");
    document.querySelector(".klik-keranjang i p").classList.toggle("klik");
  });

klikFilter.addEventListener("click", function () {
  document.querySelector(".categories-container").classList.toggle("klik");
  klikFilter.classList.toggle("bx-x");
});

const inputCariProduk = document.querySelector("#inputCari");
inputCariProduk.addEventListener("input", function () {
  searchByName(inputCariProduk.value);
});

fetchData();