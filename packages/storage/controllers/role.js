module.exports = function(_exports) {
  async function createRole(orm, roleType) {
    const { Permission, Role } = orm;

    let operation;
    switch(roleType) {
      case 'speaker':
        roleType = 'speaker';
        operation = 'push';
        break;
      case 'audience':
      default:
        roleType = 'audience';
        operation = 'pull';
    }
    const permission = await Permission.findOne({ where: { RTCOperation: operation }})

    const role = new Role({
        RTCRole: roleType,
        permission: permission.id,
    });

    await role.save();

    return role;
  }

  async function removeRole() {
  }

  async function findRole(orm, roleType) {
    const { Role } = orm;

    switch(roleType) {
      case 'speaker':
        roleType = 'speaker';
        break;
      case 'audience':
      default:
        roleType = 'audience';
    }

    const role = await Role.findOne({where: {RTCRole: roleType}});

    return role;
  }

  async function updateRole() {
  }

  _exports.createRole = createRole;
  _exports.findRole = findRole;
  _exports.removeRole = removeRole;
  _exports.updateRole = updateRole;
}
