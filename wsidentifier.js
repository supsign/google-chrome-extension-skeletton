import { load } from "./loader.js";

export function wsIdentifier(mutationsList, observer) {
  if (!mutationsList || !Array.isArray(mutationsList)) {
    return;
  }
  for (const mutation of mutationsList) {
    if (mutation.addedNodes) {
      for (const addedNode of mutation.addedNodes) {
        load(wsIdentifier, addedNode);

        if (addedNode.id === "wfModalDlgBoxOrderTypeContacts") {
          console.log("addedNode :", addedNode);
          console.log(
            "addedNode.constructor.name :",
            addedNode.constructor.name
          );
          if (!(addedNode instanceof HTMLDivElement)) {
            return;
          }
          let iFrameNode = document.getElementById(
            "wfModalDlgBodyOrderTypeContacts"
          );
          let belegIds = [];
          let aspId;
          iFrameNode.onload = () => {
            if (!(iFrameNode instanceof HTMLIFrameElement)) {
              return;
            }
            let tableElement = iFrameNode.contentWindow.document.getElementById(
              "tblListBody_lstMain"
            );
            let mailElements1 = iFrameNode.contentWindow.document.getElementsByClassName(
              "clsItem1"
            );
            let mailElements = iFrameNode.contentWindow.document.getElementsByClassName(
              "clsItem"
            );

            mailElements1[0].childNodes[1].childNodes[0].childNodes.forEach(
              node => {
                if (aspId) {
                  return;
                }
                if (node.nodeType && node.nodeType === 1) {
                  if (node.value && node.value !== "0") {
                    aspId = node.value;
                  }
                }
              }
            );

            for (const element of mailElements1) {
              let wfitemid = element.attributes.getNamedItem("wfitemid");
              if (wfitemid) {
                belegIds.push(wfitemid.value);
              }
            }
            for (const element of mailElements) {
              let wfitemid = element.attributes.getNamedItem("wfitemid");
              if (wfitemid) {
                belegIds.push(wfitemid.value);
              }
            }

            const setAll = () => {
              // const file = loadFile("https://node.supsign.dev/file");
              // console.log("file :", file);
              // var myRequest = new XMLHttpRequest();
              // myRequest.open(
              //   "POST",
              //   "https://cloud.myfactory-ondemand.ch/saas/ie50/base/documents/upload/documentUploadProcessMulti.aspx" +
              //     "?ClientID=" +
              //     msClientID,
              //   false
              // );

              // var formData = new FormData();

              // formData.append("System", false);
              // formData.append("Type", -1);
              // formData.append("DialogType", "Quickdrop");
              // formData.append("Group:", undefined);
              // formData.append("AllDivisions", true);
              // formData.append("AllPermissions", true);
              // formData.append("Public", false);
              // formData.append("SubDir", undefined);

              // // HTML file input, chosen by user
              // formData.append("userfile", fileInputElement.files[0]);

              // // JavaScript file-like object
              // var content = '<a id="a"><b id="b">hey!</b></a>'; // the body of the new file...
              // var blob = new Blob([content], { type: "text/xml" });

              // formData.append("file", file);

              // var request = new XMLHttpRequest();
              // request.open("POST", "http://foo.com/submitform.php");
              // myRequest.send(formData);
              for (const element of mailElements1) {
                let selector = element.childNodes[1].childNodes[0];
                console.log("selector :", selector.constructor.name);
                if (selector.value !== aspId) {
                  selector.value = aspId;
                  selector.dispatchEvent(new Event("change"));
                }
              }
              for (const element of mailElements) {
                let selector = element.childNodes[1].childNodes[0];
                console.log("selector :", selector.constructor.name);
                if (selector.value !== aspId) {
                  selector.value = aspId;
                  selector.dispatchEvent(new Event("change"));
                }
              }
              for (const belegId of belegIds) {
                iFrameNode.contentWindow.mOnListViewCboChange(
                  "lstMain",
                  "Contact",
                  belegId,
                  aspId
                );
              }
            };

            const buttonElement = iFrameNode.contentWindow.document.getElementById(
              "cmdClose"
            );
            if (!buttonElement) {
              return;
            }
            const buttonToSetAll = iFrameNode.contentWindow.document.createElement(
              "button"
            );
            buttonToSetAll.innerHTML = "setAll";
            buttonToSetAll.onclick = setAll;
            buttonElement.parentElement.insertBefore(
              buttonToSetAll,
              buttonElement
            );
          };
        }

        if (addedNode.id === "wfModalDlgBoxOrderTypeContacts") {
        }
      }
    }
  }
}

const setAndDispatchAspSelectorForBeleg = (selector, aspId) => {
  if (!(selector instanceof HTMLSelectElement)) {
    return;
  }
  if (selector.value !== aspId) {
    selector.value = aspId;
    selector.dispatchEvent(new Event("change"));
  }
};

function loadFile(filePath) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filePath, false);
  xmlhttp.send();
  if (xmlhttp.status == 200) {
    result = xmlhttp.responseText;
  }
  return result;
}
