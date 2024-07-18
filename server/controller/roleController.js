const Role = require('../models/roleModels');
const User = require('../models/userModels');

// create role

exports.createRole = async (req, res) => {
    try {
        const { name, menus } = req.body;
        const newRole = new Role({ name, menus });
        // check if role already exists
        const roleExists = await Role.findOne({ name });
        if (roleExists) {
            return res.status(400).json({ message: 'Role already exists' });
        }
        const savedRole = await newRole.save();
        res.status(201).json(savedRole);
    } catch (error) {

        return res.status(500).json({ error: error.message });
    }
};


exports.getRoles = async (req, res) => {

    try {

        const page = parseInt(req.query.page);
        const per_page_record = parseInt(req.query.per_page_record);

        let roles;
        let total;

        if (page && per_page_record) {
            const pageInt = parseInt(page);
            const perPageRecordInt = parseInt(per_page_record);
            const startIndex = (pageInt - 1) * perPageRecordInt;
            total = await Role.countDocuments();
            roles = await Role.find()
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(startIndex)
                .limit(perPageRecordInt);
        } else {
            roles = await Role.find().sort({ createdAt: -1 });
            total = roles.length;
        }

        return res.json({
            message: "Role list retrieved successfully",
            data: roles,
            total: total,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

}


// assign role to user

exports.assignRole = async (req, res) => {
    try {
        const { role, userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.role = role;
        await user.save();
        res.status(200).json({ message: 'Role assigned successfully', data: user });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// get Role by id

exports.getRoleById = async (req, res) => {
    try {
        const roleId = req.params.id;
        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json(role);
    } catch (err) {
        return res.status(500).json({ error: error.message });
    }
}