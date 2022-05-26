import { Toast } from 'vant';

const
verification = {
  checkPhone :( data, information, callback ) => {
      if( !(/^1[3456789]\d{9}$/.test(data)) ){
        setMessage( information );
        return false;
      }
      callback();
  },
  checkPass : ( data, information, callback ) => {
	let patrn=/^(\w){6,20}$/;
	console.log(data)
	if (!patrn.exec(data)) {
		
		setMessage( information );
		return false
	}
    callback();
  },
  isIDCard : ( data, information ) => {
    const IDCARDREG = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    const RESULT = IDCARDREG.test(data);
    if( information ) setMessage( information );
    return RESULT;
  },
  rulePhone :( data, information ) => {
      const RESULT = (/^1[3456789]\d{9}$/.test(data));
      if( information ) setMessage( information );
      return RESULT;
  },
  rulePass : ( data, information ) => {
    const REGEX = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}');
    const RESULT = REGEX.test(data);
    if( information ) setMessage( information );
    return RESULT;
  },
}

function setMessage( information ){
  Toast(information);
}
export default verification;
