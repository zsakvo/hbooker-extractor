const crypto = require("crypto");
// let key = crypto
//   .createHash("sha256")
//   .update("zG2nSeEfSHfvTCHy5LCcqtBbQehKNLXn")
//   .digest();

var decrypt = function decrypt(data, key) {
  if (key == null) {
    key = crypto
      .createHash("sha256")
      .update("zG2nSeEfSHfvTCHy5LCcqtBbQehKNLXn")
      .digest();
  } else {
    key = crypto
      .createHash("sha256")
      .update(key)
      .digest();
  }
  let decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    key,
    new Uint8Array(16)
  );
  decipher.setAutoPadding(false);
  let decrypted = decipher.update(data, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

module.exports = decrypt;
