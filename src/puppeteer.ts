
// eslint-disable-next-line @typescript-eslint/no-var-requires
const puppeteer = require('puppeteer-core')

export const avinodeSearch = async (page: any) => {
  await page.$$eval(".t-company-link", (elements: string | any[]) => {
    const getParentElement = (element: { parentElement: any; }) => {
      // find the parent element which has the class "row avi-list-item avi-list-item-expandable"
      let parent = element.parentElement;
      while (
        parent.className !== "row avi-list-item avi-list-item-expandable"
      ) {
        parent = parent.parentElement;
      }
      return parent;
    };
    const getChildElement = (element: { children: string | any[]; }) => {
      // find the last child element of the parent element
      const child = element.children[element.children.length - 1];
      // return the next child element of the last child element
      return child.children[0];
    };

    const getAircraftName = (element: { children: any[]; }) => {
      // get the 2nd child element of the parent element
      const child = element.children[1];
      // get the <a> element of child
      return child.children[0].innerText;
    };

    const companyNames: string[] = [];
    const flightArr = [];
    for (let i = 0; i < elements.length; i++) {
      // if companyNames array.lenght is >= 30, break the loop
      if (companyNames.length >= 30) {
        break;
      }
      if (
        elements[i].parentElement.parentElement.parentElement.parentElement
          .parentElement.className ===
          "row avi-list-item avi-list-item-expandable" ||
        elements[i].parentElement.parentElement.parentElement.parentElement
          .className === "row avi-list-item avi-list-item-expandable"
      ) {
        const companyName = elements[i].innerText;
        const par = getParentElement(elements[i]);
        const button = getChildElement(par);
        const aircraftName = getAircraftName(par);
        const operatorAndJet = companyName + " " + aircraftName;
        if (!companyNames.includes(operatorAndJet)) {
          button.click();
          companyNames.push(operatorAndJet);
          flightArr.push({ company: companyName, jet: aircraftName });
        }
      }
    }
    return flightArr;
  });
}

