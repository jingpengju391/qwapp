import verification from './start/verification';
import person from './person';
import upload from './upload';
const
common = {
  ...verification,
  ...person,
  ...upload
}

export default common;
