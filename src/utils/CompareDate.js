export default function compareDates(dateOneString, dateTwoString) {
  let dateOne = new Date(dateOneString);
  let dateTwo = new Date(dateTwoString);
  if (
    dateOne.toString() === "Invalid Date" ||
    dateTwo.toString() === "Invalid Date"
  ) {
    return -1;
  }
  if (dateOne.getFullYear() > dateTwo.getFullYear()) {
    return -1;
  } else if (dateOne.getFullYear() < dateTwo.getFullYear()) {
    return 1;
  } else {
    if (dateOne.getMonth() > dateTwo.getMonth()) {
      return -1;
    } else if (dateOne.getMonth() < dateTwo.getMonth()) {
      return 1;
    } else {
      return 0;
    }
  }
}