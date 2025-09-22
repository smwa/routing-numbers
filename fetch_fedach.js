const fedach_participants = [];

const get = async (aba) => {
  const url = `https://www.frbservices.org/EPaymentsDirectory/achResults.html?bank=&aba=${aba}&state=+&city=+&submitButton=Search&referredBy=searchAchPage`;
  const r = await fetch(url)
  const html = await r.text();
  if (!html.includes("results_table")) return null;
  
  let a = document.createElement('div')
  a.innerHTML = html;
  const rows = a.querySelectorAll('#results_table > tbody > tr');
  
  const ret = [];
  for (const row of rows){
    ret.push({
      "routingNumber": row.children.item(1).textContent.trim().replace(/\-/gm, ""),
      "link": row.children.item(1).children.item(0).href,
      "name": row.children.item(2).textContent,
      "city": row.children.item(3).textContent,
      "state": row.children.item(4).textContent,
    });
  };
  return ret;
};

const hunt = async (prefix) => {
  const t = await get(prefix);
  if (t == null) { // no results table in html
    let s = "";
    for (var i = 0; i < 10; i++) {
      s = i.toString();
      await hunt(prefix + s);
    }
  }
  else {
    console.log(prefix);
    fedach_participants.push(...t);
  }
};

const init = async () => {
  let s = "";
  for (var i = 0; i < 100; i++) {
    s = i.toString().padStart(2, "0");
    await hunt(s);
  }
  console.log(fedach_participants);
};

init();
