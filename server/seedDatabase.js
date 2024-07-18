const mongoose = require('mongoose');
const User = require('./models/userModel');
const Role = require('./models/roleModel');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    await mongoose.connect('mongodb+srv://gitanshugautam7:r43VE2EfxSsmwyHk@cluster0.ubx8jbj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

    const superadminRole = new Role({
        name: 'Superadmin',
        menus: ['Dashboard', 'Profile', 'Settings', 'Reports', 'Notifications', 'User Management', 'Role Management', 'Book Management']
    });

    const userRole = new Role({
        name: 'User',
        menus: ['Dashboard', 'Profile', 'Settings', 'Reports', 'Notifications']
    });

    await superadminRole.save();
    await userRole.save();

    const userPassword = '12345678';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPassword, salt);


    const superadmin = new User({
        username: 'admin',
        name: 'admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: superadminRole._id
    });

    const user = new User({
        username: 'user',
        name: 'user',
        email: 'user@gmail.com',
        password: hashedPassword,
        role: userRole._id
    });

    await superadmin.save();
    await user.save();

    console.log('Database seeded!');
    process.exit();
};

seedDatabase().catch(err => console.error(err));
