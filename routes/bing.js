var express = require("express");
var router = express.Router();
const puppeteer = require("puppeteer");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  const content = await search(
    // "https://noticias.reclameaqui.com.br/uploads/403348113.jpg"
    "https://st2.depositphotos.com/1005147/5192/i/450/depositphotos_51926417-stock-photo-hands-holding-the-sun-at.jpg"
  );
  console.log(content);
  await res.send(content);
});

async function search(link) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: false,
  });
  const page = await browser.newPage();

  const imageLink = `https://www.bing.com/images/search?view=detailv2&iss=sbi&q=imgurl:${link}`;

  await page.goto(imageLink);

  await page.waitForSelector("#bnp_btn_accept");
  await page.click("#bnp_btn_accept");

  const table_selector =
    "#detailCanvas > div.insights > div > div.tab-head > div > ul > li.t-pim.nofocus";
  await page.waitForSelector(table_selector);
  await page.click(table_selector);

  let contents = await page.evaluate((sel) => {
    const els = document.getElementsByClassName(sel);
    let urls = [];
    for (let index = 0; index < els.length; index++) {
      const el = els[index];
      const ulr = el.getElementsByClassName("dfnc")[0].href;
      urls.push(ulr);
    }
    return urls;
  }, "pigc");

  await browser.close();
  return contents;
}

module.exports = router;
