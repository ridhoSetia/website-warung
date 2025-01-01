// api/index.js
import path from 'path';

export default function handler(req, res) {
  res.sendFile(path.join(process.cwd(), 'index.html'));
}
