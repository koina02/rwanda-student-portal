const express = require('express');
const Course = require('../models/Course');
const authMiddleware = require('../middleware/authMiddleware');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

// 🧠 Create a course (Admin or Instructor only)
router.post(
  '/',
  authMiddleware,
  catchAsync(async (req, res, next) => {
    const { title, description, instructor, content, price } = req.body;

    if (!['admin', 'instructor'].includes(req.user.role)) {
      return next(new AppError('Access denied. Only admins and instructors can create courses.', 403));
    }

    const course = await Course.create({ title, description, instructor, content, price });

    res.status(201).json({
      status: 'success',
      message: 'Course created successfully',
      data: { course },
    });
  })
);

// 📚 Get all courses (Public)
router.get(
  '/',
  catchAsync(async (req, res, next) => {
    const courses = await Course.find();

    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: { courses },
    });
  })
);

// 🔍 Get course by ID (Public)
router.get(
  '/:id',
  catchAsync(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError('Course not found', 404));

    res.status(200).json({
      status: 'success',
      data: { course },
    });
  })
);

// 🛠️ Update a course (Admin or Instructor only)
router.put(
  '/:id',
  authMiddleware,
  catchAsync(async (req, res, next) => {
    if (!['admin', 'instructor'].includes(req.user.role)) {
      return next(new AppError('Access denied. Only admins and instructors can update courses.', 403));
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCourse) return next(new AppError('Course not found', 404));

    res.status(200).json({
      status: 'success',
      message: 'Course updated successfully',
      data: { course: updatedCourse },
    });
  })
);

// ❌ Delete a course (Admin only)
router.delete(
  '/:id',
  authMiddleware,
  catchAsync(async (req, res, next) => {
    if (req.user.role !== 'admin') {
      return next(new AppError('Access denied. Only admins can delete courses.', 403));
    }

    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return next(new AppError('Course not found', 404));

    res.status(200).json({
      status: 'success',
      message: 'Course deleted successfully',
    });
  })
);

module.exports = router;
