// Checking for license compats using license-compatibility-checker
const lcc = require('license-compatibility-checker'),
	path = require('path');

lcc.check(path.join(__dirname,'../package.json'), path.join(__dirname,"../node_modules"),function(/*error*/ err,/*boolean*/ passed,/*string*/ output){
  if (err) console.log(err);
  else if (passed)
  {
	//No license issues found
	console.log(output);
  } else
  { 
	//License issues found 
	console.log(output);
	//process.exit(1);
	//or
	//throw new Error('License issues found');
  }  
});
