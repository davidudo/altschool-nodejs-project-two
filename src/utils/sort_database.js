/**
 * This utility function helps sort the database
 * in an arithmetic order using the (id) property
 * from the lowest to the highest id
 */

const sortDatabase = function (database, property) {
  function sortByProperty(property) {
    return function(a, b) {
      if (a[property] > b[property])
        return 1;
      else if (a[property] < b[property])
        return -1;

      return 0;
    }
  }

  database.sort(sortByProperty(property));
}

module.exports = {
  sortDatabase
}