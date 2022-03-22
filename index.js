//import "dotenv/config"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
require("dotenv").config();

console.log(process.env.API_KEY);

export default function returnApiKey() {
  return process.env.API_KEY;
}
