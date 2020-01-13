export function fastOrder(element) {
  if (!(element instanceof HTMLIFrameElement)) {
    return;
  }
  element.onload = () => {
    const fastOrder = element.contentWindow.document;
    const fastOrderWindow = element.contentWindow;
    const memoButton = fastOrder.getElementById("cmdMemo");
    const orderNummerInput = fastOrder.getElementById("txtOrderNumber");
    var targetProxy = new Proxy(orderNummerInput.nodeValue, {
      set: function(target, key, value) {
        console.log(`${key} set to ${value}`);
        target[key] = value;
        return true;
      }
    });

    const loadTechDocumentButton = fastOrder.createElement("button");

    loadTechDocumentButton.innerHTML = "Datenblatt";
    loadTechDocumentButton.classList.add("cmdButton");
    loadTechDocumentButton.onclick = updoadDataSheet;
    memoButton.insertAdjacentElement("afterend", loadTechDocumentButton);
    const orderID = fastOrderWindow.mlSalesOrderID();
    if (orderID === 0) {
      loadTechDocumentButton.disabled = true;
    }
  };
}

function loadFileDataSheet() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "https://node.supsign.dev/file", true);
  xmlhttp.responseType = "blob";
  xmlhttp.onload = function(oEvent) {
    if (xmlhttp.status === 200) {
      var pdf = xmlhttp.response;

      // updaodFileToMf(pdf);
    }
  };
  xmlhttp.send();
}

function updoadDataSheet() {
  loadFileDataSheet();
}

function updaodFileToMf(file) {
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

  myRequest.send(formData);
}

function onChange() {
  console.log("change");
}
