var cmeOrderNummberInput;
var cmeLoadTechDocumentButton;
var cmeGetOrderId;

export function fastOrder(element) {
  if (!(element instanceof HTMLIFrameElement)) {
    return;
  }
  element.onload = () => {
    const fastOrder = element.contentWindow.document;
    const fastOrderWindow = element.contentWindow;
    const memoButton = fastOrder.getElementById("cmdMemo");

    // get the OrderNumberField
    cmeOrderNummberInput = fastOrder.getElementById("txtOrderNumber");

    //Creat
    cmeLoadTechDocumentButton = fastOrder.createElement("button");
    cmeLoadTechDocumentButton.innerHTML = "Datenblatt";
    cmeLoadTechDocumentButton.classList.add("cmdButton");
    cmeLoadTechDocumentButton.onclick = updoadDataSheet;
    memoButton.insertAdjacentElement("afterend", cmeLoadTechDocumentButton);
    cmeGetOrderId = fastOrderWindow.mlSalesOrderID;
    cmeLoadTechDocumentButton.disabled = true;
  };
}

async function loadFileDataSheet() {
  var xmlhttp = new XMLHttpRequest();

  console.log("orderNummberInput :", cmeOrderNummberInput.value);
  xmlhttp.open(
    "GET",
    "http://localhost:3000/api/tech-docs/AN2001285/techDoc",
    true
  );
  xmlhttp.responseType = "blob";

  // set the button on disabled during load
  cmeLoadTechDocumentButton.disabled = true;
  cmeLoadTechDocumentButton.innerHTML = "Laden";

  xmlhttp.onload = async function(oEvent) {
    if (xmlhttp.status === 200) {
      var pdf = xmlhttp.response;

      const fileId = await updaodFileToMf(pdf);
      addFileLink(fileId, "SalesOrders", cmeGetOrderId());
    }
  };
  xmlhttp.send();
}

function updoadDataSheet() {
  loadFileDataSheet();
}

function updaodFileToMf(file) {
  return new Promise((resolve, reject) => {
    var myRequest = new XMLHttpRequest();
    myRequest.open(
      "POST",
      "https://cloud.myfactory-ondemand.ch/saas/ie50/base/documents/upload/documentUploadProcessMulti.aspx" +
        "?ClientID=" +
        msClientID,
      false
    );

    var formData = new FormData();

    formData.append("System", false);
    formData.append("Type", -1);
    formData.append("DialogType", "Quickdrop");
    formData.append("Group", "");
    formData.append("AllDivisions", true);
    formData.append("AllPermissions", true);
    formData.append("Public", false);
    formData.append("SubDir", "");

    formData.append("file", file, "Datenblatt.pdf");
    myRequest.onload = function() {
      cmeLoadTechDocumentButton.disabled = false;
      cmeLoadTechDocumentButton.innerHTML = "Datenblatt";
      if (myRequest.status === 200) {
        const response = myRequest.response;
        if (!response || typeof response !== "string") {
          reject();
          return;
        }
        const findFileId = /var sResult.*\$([0-9]*).*';/;
        const matches = response.match(findFileId);
        if (!matches || !matches[1]) {
          reject();
          return;
        }
        const fileId = matches[1];
        if (!fileId) {
          reject();
          return;
        }
        cmeLoadTechDocumentButton.disabled = true;
        cmeLoadTechDocumentButton.innerHTML = "Laden";
        resolve(fileId);
      }
    };
    myRequest.send(formData);
  });
}

function addFileLink(fileId, entityName, entityId) {
  return new Promise((resolve, reject) => {
    var myRequest = new XMLHttpRequest();
    myRequest.open(
      "GET",
      "https://cloud.myfactory-ondemand.ch/saas/IE50/Base/Documents/DocumentAddRefProcess.aspx" +
        "?DocumentID=" +
        fileId +
        "&EntityID=" +
        entityId +
        "&EntityName=" +
        entityName +
        "&ClientID=" +
        msClientID,
      false
    );

    myRequest.onload = function() {
      cmeLoadTechDocumentButton.disabled = false;
      cmeLoadTechDocumentButton.innerHTML = "Datenblatt";
      if (myRequest.status === 200) {
        resolve();
      }

      reject();
    };
    myRequest.send();
  });
}
