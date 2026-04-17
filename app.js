// const BASE_URL = "http://localhost:3500/api"

const BASE_URL = "https://water-meter-server-api.onrender.com/api"

async function checkMeter() {
  const meterNumber = document.getElementById("meterNumber").value;
  const amount = document.getElementById("amount").value;

  if(!amount || !meterNumber){
    return alert("Please fill all");
  }

  try{
    const res = await fetch(BASE_URL + "/check-meter", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ meterNumber })
    });

    const data = await res.json();

    if(!res.ok){
      alert(data.message);
      return;
    }

    document.getElementById("m_meter").innerText = "Meter: " + meterNumber;
    document.getElementById("m_user").innerText = "User: " + data.user;
    document.getElementById("m_amount").innerText = "Amount: " + amount + " RWF";
    document.getElementById("modal").style.display = "flex";

  } catch(error){
    alert("Error Occured!");
    console.log(error.message);
  }
}

async function buyWater(){
  const meterNumber = document.getElementById("meterNumber").value;
  const amount = document.getElementById("amount").value;

  try{   
    const res = await fetch(BASE_URL + "/buy", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ meterNumber, amount })
    });

    const data = await res.json();

    if(!res.ok){
      alert(data.message);
      return;
    }

    document.getElementById("content").innerHTML = `
          <h3>Payment successful with token:</h3>
          <p id="token">${data.token}</p>
          <div class="buttons">
            <button id="copy" class="cancel" onclick="copyToken()">COPY TOKEN</button>
            <button class="buy" onclick="closeModal()">OK</button>
          </div>
    `
    document.getElementById("meterNumber").value="";
    document.getElementById("amount").value="";

  } catch(error){
    alert("Error occured");
    console.log(error.message);
  }
}
function closeModal(){
  document.getElementById("modal").style.display = "none";
  document.getElementById("content").innerHTML = `
      <h3>Confirm Payment</h3>
      <p id="m_meter"></p>
      <p id="m_user"></p>
      <p id="m_amount"></p>

      <div class="buttons">
        <button class="cancel" onclick="closeModal()">Cancel</button>
        <button class="buy" onclick="buyWater()">Buy</button>
      </div>
    `
}

function copyToken() {
  const token = document.getElementById("token").innerHTML;
  navigator.clipboard.writeText(token)
    .then(() => {
      document.getElementById("copy").innerHTML = "COPIED";
    })
    .catch(err => console.error(err));
}