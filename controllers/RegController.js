require('dotenv').config();
const yup = require('yup');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const services = require('../src/services/services');

const NEW_USER_CREATED = 'New user is created';
const INVALID_LOGIN = 'invalid login';
const WRONG_PASS_OR_LOGIN = 'Wrong pass or login';
const YOU_ARE_BANNED = 'You are banned';
const USER_LOGGED_IN = 'User logged in';

const schema = yup.object().shape({
  login: yup.string().required().min(3).matches(/\w/),
  pass: yup.mixed().required(),
});

const colors = () => {
  const rainbow = ['black', 'blue', 'green', 'lime', 'yellow', 'red'];
  return rainbow[Math.floor(Math.random() * rainbow.length)];
};

const giveToken = id => {
  const token = jwt.sign({ id }, process.env.SECRET_KEY);
  return token;
};

const createNewUser = async (login, pass, res, asAdmin = false) => {
  const salt = 10;
  const hashedPass = await bcrypt.hash(pass, salt);

  const savedUser = await services.addNewUser({
    login,
    pass: hashedPass,
    color: colors(),
    isAdmin: asAdmin,
  });

  return res.status(201).json({
    info: NEW_USER_CREATED,
    token: giveToken(savedUser._id),
  });
};

const RegController = async (req, res) => {
  const { login, pass } = req.body;
  const isValid = await schema.isValid({
    login,
    pass,
  });

  if (!isValid) {
    return res.status(201).json(INVALID_LOGIN);
  }
  try {
    const checkName = await services.findUserByLogin(login);

    if (checkName) {
      const checkPass = await bcrypt.compare(pass, checkName.pass);
      if (!checkPass) {
        return res.status(401).json(WRONG_PASS_OR_LOGIN);
      }
      if (checkName.isBanned) {
        return res.status(401).json(YOU_ARE_BANNED);
      }

      return res
        .status(201)
        .json({ info: USER_LOGGED_IN, token: giveToken(checkName._id) });
    }

    if (!(await services.getAllUsers()).length) {
      return createNewUser(login, pass, res, true);
    }

    createNewUser(login, pass, res);
  } catch (e) {
    console.log(e);
  }
};

module.exports = RegController;
