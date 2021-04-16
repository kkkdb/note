var friends = [
  { name: "John", age: 22 },
  { name: "Peter", age: 23 },
  { name: "Mark", age: 24 },
  { name: "Maria", age: 22 },
  { name: "Monica", age: 21 },
  { name: "Martha", age: 19 }
];

let nameList = Array.from(friends, ({ name }) => name);
console.log(nameList);
//[ 'John', 'Peter', 'Mark', 'Maria', 'Monica', 'Martha' ]
