export const sendToken = (
  user,
  statusCode,
  res,
  message
) => {
  const token = user.getJWTToken();

  const cookieExpireDays =
    Number(process.env.COOKIE_EXPIRE) || 7;

  const options = {
    expires: new Date(
      Date.now() +
        cookieExpireDays *
          24 *
          60 *
          60 *
          1000
    ),
    httpOnly: true,

    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",

    secure:
      process.env.NODE_ENV === "production",
  };

  const sanitizedUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    studentProfile: user.studentProfile,
    companyProfile: user.companyProfile,
    collegeProfile: user.collegeProfile,
  };

  res.status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      message,
      token,
      user: sanitizedUser,
    });
};