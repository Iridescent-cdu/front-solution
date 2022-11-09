/**
 * 用户名的表单校验
 * @param {*} val  val用户输入的内容
 * @returns  true表示表单校验通过,String表示表单校验未通过，并且String为提示信息
 */
export const validateUsername = (val) => {
  if (!val) {
    return '用户名为必填项'
  }
  if (val.length < 3 || val.length > 12) {
    return '用户名应该在3-12位之间'
  }
  return true
}

/**
 * 密码的表单校验
 */
export const validatePassword = (val) => {
  if (!val) {
    return '密码为必填项'
  }
  if (val.length < 3 || val.length > 12) {
    return '密码应该在6-12位之间'
  }
  return true
}

/**
 * 确认密码表单校验，关联密码所以需要注册
 * 1.定义方法
 * 2.注册这个校验
 */
export const validateConfirmPassword = (val, password) => {
  if (val !== password[0]) {
    return '两次密码输入不一致'
  }
  return true
}
