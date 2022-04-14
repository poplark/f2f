module.exports = function(_exports) {
  async function findPermissions(orm) {
    const { Permission } = orm;
    return await Permission.findAll();
  }

  async function createPermission(orm, RTCOperation) {
    const { Permission } = orm;
    const permission = new Permission({
      RTCOperation,
    });
    await permission.save();
    return permission;
  }

  async function findPermissionByOperation(orm, RTCOperation) {
    const { Permission } = orm;
    return await Permission.findOne({ where: { RTCOperation }});
  }

  _exports.findPermissions = findPermissions;
  _exports.createPermission = createPermission;
  _exports.findPermissionByOperation = findPermissionByOperation;
}
