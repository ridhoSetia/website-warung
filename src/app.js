async function fetchData() {
  function capitalizeFirstLetter(sentence) {
    return sentence
      .split(" ") // Pecah kalimat menjadi array kata-kata
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Kapitalisasi huruf pertama dan ubah sisanya menjadi huruf kecil
      .join(" "); // Gabungkan kembali menjadi kalimat
  }
  const response = await fetch("http://localhost:3000/data");
  const data = await response.json();

  const container = document.getElementById("container-product");
  container.innerHTML = "";

  let iBox = 0;
  data.forEach((item) => {
    const product = document.createElement("div");
    product.id = "product";

    let hargaIDN = new Intl.NumberFormat("id-ID").format(item.harga);

    product.innerHTML = `
    <div class="content ${item.kategori}">
      <div class="img">
        <img src="img/gambar-${item.gambar}" alt="${item.nama}" />
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
    product.classList.add(`produk${iBox}`);
    iBox++;
    container.appendChild(product);
  });

  const products = document.querySelectorAll("#product");

  products.forEach((product) => {
    const handleClick = () => {
      console.log("Nama product: ", product.className);

      product.classList.toggle("klik");

      if (product.classList.contains("klik")) {
        let lastIndex = Array.from(product.classList).length - 2;
        let lastClass = Array.from(product.classList)[lastIndex];

        const total = document.querySelector("#total");
        total.innerHTML += `
        <div class="jmlh ${lastClass}">
          <div class="detail">
            <p>${product.className.replace(/\bproduk\d*\b|\bklik\b/g, "")}</p>
            <input type="number" id="jumlah" class="inpjmlh ${lastClass}" value=1>
          </div>
          <p class="nominal">Total: </p>
        </div>
        `;

        // Simpan ke local storage
        const inputJumlah = document.querySelector(`.inpjmlh.${lastClass}`);
        localStorage.setItem(lastClass, inputJumlah.value);

        console.log(
          `Disimpan ke local storage: ${lastClass} = ${inputJumlah.value}`
        );

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
          const hargaTotalIDN = new Intl.NumberFormat("id-ID").format(
            totalHarga
          );
          const totalPerBarang = document.querySelector(
            `.jmlh.${lastClass} .nominal`
          );
          totalPerBarang.textContent = `Total: Rp${hargaTotalIDN}`;

          // Simpan perubahan ke local storage
          localStorage.setItem(lastClass, jumlahInput.value);
          console.log(
            `Diperbarui di local storage: ${lastClass} = ${jumlahInput.value}`
          );
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
        localStorage.setItem(lastClass, 1);

        // Hitung total semua harga
        const semuaTotalPerBarang = document.querySelectorAll(".jmlh .nominal");
        let totalSemuaHarga = 0;

        semuaTotalPerBarang.forEach((totalBarang) => {
          const totalText = totalBarang.textContent.replace(/\D/g, ""); // Ambil angka saja
          totalSemuaHarga += Number(totalText);
        });

        // Tampilkan total semua harga
        const totalSemuaHargaElement = document.querySelector(
          "#harga-total .nominal"
        );
        const totalSemuaHargaIDN = new Intl.NumberFormat("id-ID").format(
          totalSemuaHarga
        );
        totalSemuaHargaElement.textContent = totalSemuaHargaIDN;

        // Muat nilai dari local storage jika ada
        const storedValue = localStorage.getItem(lastClass);
        if (storedValue !== null) {
          jumlahInput.value = storedValue;
          console.log(
            `Memuat dari local storage: ${lastClass} = ${storedValue}`
          );

          // Perbarui total sesuai nilai tersimpan
          const intHarga = Number(
            document.querySelector(
              `.${lastClass} .content .description .text p i`
            ).className
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
          let storedValue = localStorage.getItem(inputKey);

          if (storedValue !== null) {
            input.value = storedValue;
            console.log(
              `Memuat dari local storage: ${inputKey} = ${storedValue}`
            );
          }
        });
      } else {
        let lastIndex = Array.from(product.classList).length - 1;
        let lastClass = Array.from(product.classList)[lastIndex];

        // Hapus elemen terkait dari DOM
        let inputToRemove = document.querySelector(`.jmlh.${lastClass}`);
        if (inputToRemove) {
          // Ambil nilai total yang akan dihapus
          const totalText = inputToRemove
            .querySelector(".nominal")
            .textContent.replace(/\D/g, "");
          const totalToRemove = Number(totalText);

          // Kurangi dari total semua harga
          const totalSemuaHargaElement = document.querySelector(
            "#harga-total .nominal"
          );
          let currentTotal = Number(
            totalSemuaHargaElement.textContent.replace(/\D/g, "")
          );
          currentTotal -= totalToRemove;

          // Perbarui tampilan total semua harga
          const updatedTotalIDN = new Intl.NumberFormat("id-ID").format(
            currentTotal
          );
          totalSemuaHargaElement.textContent = updatedTotalIDN;

          // Hapus elemen dari DOM
          inputToRemove.remove();
        }

        // // Hapus data dari local storage
        // localStorage.removeItem(lastClass);
        // console.log(`Data local storage ${lastClass} dihapus.`);
      }

      const inputJumlah = document.querySelectorAll("#jumlah");
      inputJumlah.forEach((inpjmlh) => {
        inpjmlh.addEventListener("change", function () {
          let inputJmlh = document.querySelector(
            `.inpjmlh.${inpjmlh.classList[1]}`
          );
          console.dir(inputJmlh);

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

          // Hitung total semua harga
          const semuaTotalPerBarang =
            document.querySelectorAll(".jmlh .nominal");
          let totalSemuaHarga = 0;

          semuaTotalPerBarang.forEach((totalBarang) => {
            const totalText = totalBarang.textContent.replace(/\D/g, ""); // Ambil angka saja
            totalSemuaHarga += Number(totalText);
          });

          // Tampilkan total semua harga
          const totalSemuaHargaElement = document.querySelector(
            "#harga-total .nominal"
          );
          const totalSemuaHargaIDN = new Intl.NumberFormat("id-ID").format(
            totalSemuaHarga
          );
          totalSemuaHargaElement.textContent = totalSemuaHargaIDN;

          // Update nilai di local storage
          localStorage.setItem(lastClass, inputJmlh.value);
          console.log(
            `Diperbarui di local storage: ${lastClass} = ${inputJmlh.value}`
          );
        });
      });
    };

    product.addEventListener("click", handleClick);
  });
}

document
  .querySelector(".klik-keranjang")
  .addEventListener("click", function () {
    document.querySelector(".keranjang-belanja").classList.toggle("klik");
  });

fetchData();
