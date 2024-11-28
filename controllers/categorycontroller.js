const Category = require("../models/CategoryModel");
const Project = require("../models/ProjectModel");
// Controller to get a category and its projects
const getCategoryWithProjects = async (req, res) => {
  try {
    const { categoryName } = req.params; // Extract category name from URL params

    // Find category by name (case insensitive)
    const category = await Category.findOne({
      categoryName: new RegExp(`^${categoryName}$`, "i"),
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Return the category with its projects
    return res.status(200).json({
      message: "Category fetched successfully",
      category: {
        categoryName: category.categoryName,
        projects: category.projects,
      },
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching the category" });
  }
};

// Controller to create a new category
const createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body; // Extract category name and projects from request body

    // Validate input
    if (!categoryName || typeof categoryName !== "string") {
      return res
        .status(400)
        .json({ message: "Category name is required and must be a string" });
    }

    // Check if the category already exists (case insensitive)
    const existingCategory = await Category.findOne({
      categoryName: new RegExp(`^${categoryName}$`, "i"),
    });
    if (existingCategory) {
      return res
        .status(409)
        .json({ message: "Category with this name already exists" });
    }

    // Create the category
    const newCategory = new Category({
      categoryName, // Initialize with provided projects or an empty array
    });

    // Save to database
    const savedCategory = await newCategory.save();

    return res.status(201).json({
      message: "Category created successfully",
      success: true,
      category: savedCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while creating the category" });
  }
};

const editCategory = async (req, res) => {
  try {
    const { categoryName, newCategoryName, reassignProjects } = req.body;

    if (!categoryName || !newCategoryName) {
      return res
        .status(400)
        .json({ message: "Both categoryName and newCategoryName are required" });
    }

    // Find the category by name and get its _id
    const category = await Category.findOne({
      categoryName: new RegExp(`^${categoryName}$`, "i"),
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    //console.log("Found category:", category);

    // Rename the category
    category.categoryName = newCategoryName;

    // If reassignProjects flag is true, update the category field in the projects
    if (reassignProjects) {
      const projects = await Project.updateMany(
        { category: category._id },  // Update using the category's ObjectId
        { $set: { category: category._id } }  // Reassign the category using its ObjectId
      );
      //console.log("Updated projects:", projects);
    }

    // Save the updated category
    await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
      success: true,
      category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the category" });
  }
};


//controller to get all categories
const getAllCategories = async (req, res) => {
  try {
    // Fetch all categories, including their categoryName
    const categories = await Category.find({}, "categoryName");

    if (!categories.length) {
      return res.status(404).json({ message: "No categories found" });
    }

    // Return categories as an array of objects
    return res.status(200).json({
      message: "Categories fetched successfully",
      categories: categories.map((category) => ({
        categoryName: category.categoryName,  // Return each category as an object
      })),
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching categories" });
  }
};

//controller to create project in existing category
const addProjectToCategory = async (req, res) => {
  try {
    const {
      categoryName,
      projectName,
      details,
      status,
      progress,
      startDate,
      endDate,
      client,
    } = req.body;

    // Validate input
    if (!categoryName || !projectName) {
      return res
        .status(400)
        .json({ message: "Category Name and Project Name are required" });
    }

    // Find the category by name (case insensitive)
    const category = await Category.findOne({
      categoryName: new RegExp(`^${categoryName}$`, "i"),
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if the project already exists in the category (case insensitive)
    const existingProject = category.projects.find(
      (project) =>
        project.projectName.toLowerCase() === projectName.toLowerCase()
    );

    if (existingProject) {
      return res
        .status(409)
        .json({
          message: "Project with this name already exists in the category",
        });
    }

    // Create a new project object
    const newProject = {
      projectName,
      details,
      status,
      progress,
      startDate,
      endDate,
      client,
    };

    // Add the project to the category
    category.projects.push(newProject);

    // Save the updated category
    const updatedCategory = await category.save();

    return res.status(200).json({
      message: "Project added successfully",
      success: true,
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error adding project to category:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while adding the project" });
  }
};

//controller to create project with no category
const createProjectNoCategory = async (req, res) => {
  try {
    const { projectName, details, status, progress, startDate, endDate, client } =
      req.body;

    // Validate the input fields
    if (
      !projectName ||
      !details ||
      !status ||
      !progress ||
      !startDate ||
      !endDate ||
      !client
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create the project without a category
    const newProject = new Project({
      projectName,
      details,
      status,
      progress,
      startDate,
      endDate,
      client,
      category: null, // No category
    });

    // Save the project to the database
    const savedProject = await newProject.save();

    return res.status(201).json({
      message: "Project created successfully without category",
      success: true,
      project: savedProject,
    });
  } catch (error) {
    console.error("Error creating project without category:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while creating the project" });
  }
};

//controller to find all projects with or without category
const getAllProjects = async (req, res) => {
    try {
      // Fetch projects from all categories, including projects without categories
      const categories = await Category.find({}, "projects");
  
      const allProjects = categories.reduce((projects, category) => {
        return projects.concat(category.projects);
      }, []);
  
      // Also find projects that are not in any category (category is null)
      const projectsWithoutCategory = await Project.find({ category: { $eq: null } });
  
      // Combine both lists of projects
      const allProjectsIncludingNoCategory = allProjects.concat(projectsWithoutCategory);
  
      return res.status(200).json({
        message: "All projects fetched successfully",
        projects: allProjectsIncludingNoCategory,
      });
    } catch (error) {
      console.error("Error fetching all projects:", error);
      return res.status(500).json({ message: "An error occurred while fetching the projects" });
    }
  };  
  
const editProject = async (req, res) => {
    try {
      const { id } = req.params; // Extract project ID from the URL
      const {
        categoryName, // Optional
        projectName,
        details,
        status,
        progress,
        startDate,
        endDate,
        client,
      } = req.body;
  
      // Validate input
      if (!id) {
        return res.status(400).json({ message: "Project ID is required" });
      }
  
      // Case 1: Update project within a category
      if (categoryName) {
        // Find the category by name (case-insensitive)
        const category = await Category.findOne({
          categoryName: new RegExp(`^${categoryName}$`, "i"),
        });
  
        if (!category) {
          return res.status(404).json({ message: "Category not found" });
        }
  
        // Find the project in the category using the project ID
        const project = category.projects.id(id);
  
        if (!project) {
          return res
            .status(404)
            .json({ message: "Project not found in the specified category" });
        }
  
        // Update the project details (only update fields provided)
        project.projectName = projectName || project.projectName;
        project.details = details || project.details;
        project.status = status || project.status;
        project.progress = progress || project.progress;
        project.startDate = startDate || project.startDate;
        project.endDate = endDate || project.endDate;
        project.client = client || project.client;
  
        // Save the updated category
        await category.save();
  
        return res.status(200).json({
          message: "Project updated successfully within category",
          success: true,
          category,
        });
      } else {
        // Case 2: Update standalone project
        const project = await Project.findById(id);
  
        if (!project) {
          return res.status(404).json({ message: "Project not found" });
        }
  
        // Update the project details (only update fields provided)
        project.projectName = projectName || project.projectName;
        project.details = details || project.details;
        project.status = status || project.status;
        project.progress = progress || project.progress;
        project.startDate = startDate || project.startDate;
        project.endDate = endDate || project.endDate;
        project.client = client || project.client;
  
        // Save the updated project
        const updatedProject = await project.save();
  
        return res.status(200).json({
          message: "Project updated successfully",
          success: true,
          project: updatedProject,
        });
      }
    } catch (error) {
      console.error("Error editing project:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while editing the project" });
    }
};  

  
module.exports = {
  getCategoryWithProjects,
  createCategory,
  addProjectToCategory,
  getAllCategories,
  getAllProjects,
  createProjectNoCategory,
  editProject,
editCategory,
};
