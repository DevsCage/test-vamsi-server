const jwt = require("jsonwebtoken");

const sendTokenAdmin = (user, statusCode, res) => {
  const token = user.getJwtTokenAdmin();

  //options for cookie
  const isAuthenticated = true;

  const options = {
    expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
    httpOnly: true,
    // secure: true,
  };
  res.cookie("token", token, options);
  res.cookie("auth", isAuthenticated);
  res.status(201).json({
    success: true,
    user,
    token,
  });
};

const sendTokenStudent = (student, statusCode, res) => {
  function getJwtTokenAdmin() {
    return jwt.sign(
      {
        id: student._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_TIME,
      }
    );
  }

  const studentToken = getJwtTokenAdmin();
  console.log(studentToken, "dasdasdasdasdasd");
  //options for cookie
  const isAuthenticated = true;

  const options = {
    expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
    httpOnly: true,
    // secure: true,
  };
  res.cookie("accessToken", studentToken, options);
  res.cookie("auth", isAuthenticated);
  res.status(201).json({
    //continue bro sorry IMPORTANT CALL REGarding college
    success: true,
    student,
    studentToken,
  });
};

const sendTokenAccountant = (accountant, statusCode, res) => {
  function getJwtTokenAccountant() {
    return jwt.sign(
      {
        id: accountant._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_TIME,
      }
    );
  }

  const accountantToken = getJwtTokenAccountant();
  console.log(accountantToken, "dasdasdasdasdasd");
  //options for cookie
  const isAuthenticated = true;

  const options = {
    expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
    httpOnly: true,
    // secure: true,
  };
  res.cookie("accessToken", accountantToken, options);
  res.cookie("auth", isAuthenticated);
  res.status(201).json({
    //continue bro sorry IMPORTANT CALL REGarding college
    success: true,
    accountant,
    accountantToken,
  });
};

const sendTokenFaculty = (faculty, statusCode, res) => {
  function getJwtTokenFaculty() {
    return jwt.sign(
      {
        id: faculty._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_TIME,
      }
    );
  }

  const facultyToken = getJwtTokenFaculty();
  console.log(facultyToken, "dasdasdasdasdasd");
  //options for cookie
  const isAuthenticated = true;

  const options = {
    expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
    httpOnly: true,
    // secure: true,
  };
  res.cookie("token", facultyToken, options);
  res.cookie("auth", isAuthenticated);
  res.status(201).json({
    //continue bro sorry IMPORTANT CALL REGarding college
    success: true,
    faculty,
    facultyToken,
  });
};

module.exports = {
  sendTokenAdmin,
  sendTokenStudent,
  sendTokenAccountant,
  sendTokenFaculty,
};
