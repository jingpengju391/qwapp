import User from './user.js';
import IMList from './IMList.js';
import Audio from './audio.js';
export default{
  ...User,
  ...IMList,
  ...Audio 
};
