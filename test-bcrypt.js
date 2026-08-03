const bcrypt = require('bcryptjs');
async function test() {
  const h1 = '$2a$12$JYJxRCzgMAApRw522DhZj.RUF/3GiCAj0k2.wLOGGIVPNKFP0Dx2S';
  const h2 = '$2a$12$Hq/Po86IWhLiYMUstumPS.fX5BTIp2F6p0RVVC9uEEUowQIYirH4S';
  console.log('Old hash match admin123:', await bcrypt.compare('admin123', h1));
  console.log('New hash match admin123:', await bcrypt.compare('admin123', h2));
  console.log('Old hash match customer123:', await bcrypt.compare('customer123', h1));
  console.log('New hash match customer123:', await bcrypt.compare('customer123', h2));
}
test();
