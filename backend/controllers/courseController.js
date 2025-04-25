const Course = require('../models/Course'); // Import Course model

// Create a new course
exports.createCourse = async (req, res) => {
    try {
        const { title, description, price } = req.body;

        // Create new course
        const course = new Course({ title, description, price });
        await course.save();

        res.status(201).json({
            message: 'Course created successfully',
            course: { title: course.title, description: course.description, price: course.price, id: course._id }
        });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all courses
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a single course by ID
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        res.status(200).json(course);
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a course
exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) return res.status(404).json({ message: 'Course not found' });

        res.status(200).json({
            message: 'Course updated successfully',
            course: { title: course.title, description: course.description, price: course.price, id: course._id }
        });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
