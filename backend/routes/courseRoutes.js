const express = require('express');
const Course = require('../models/Course'); // Import Course model
const authMiddleware = require('../middleware/authMiddleware'); // JWT Middleware
const router = express.Router();

// Create a new course (Only Admins & Instructors)
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, instructor, content, price } = req.body;

  // Check if the user has permission to create courses
  if (req.user.role !== 'admin' && req.user.role !== 'instructor') {
    return res.status(403).json({ message: 'Access denied. Only admins and instructors can create courses.' });
  }

  try {
    const newCourse = new Course({ title, description, instructor, content, price });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating course: ", error);
    res.status(500).json({ message: 'Server error while creating course', error });
  }
});

// Get all courses (Public)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses: ", error);
    res.status(500).json({ message: 'Server error while fetching courses', error });
  }
});

// Get a single course by ID (Public)
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error("Error fetching course: ", error);
    res.status(500).json({ message: 'Server error while fetching course details', error });
  }
});

// Update a course (Only Admins & Instructors)
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, instructor, content, price } = req.body;

  // Check if the user has permission to update the course
  if (req.user.role !== 'admin' && req.user.role !== 'instructor') {
    return res.status(403).json({ message: 'Access denied. Only admins and instructors can update courses.' });
  }

  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, instructor, content, price },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course: ", error);
    res.status(500).json({ message: 'Server error while updating course', error });
  }
});

// Delete a course (Only Admins)
router.delete('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Only admins can delete courses.' });
  }

  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error("Error deleting course: ", error);
    res.status(500).json({ message: 'Server error while deleting course', error });
  }
});

module.exports = router;
