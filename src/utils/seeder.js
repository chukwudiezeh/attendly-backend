const mongoose = require('mongoose');

class Seeder {
  /**
   * Seeds data to a specified model
   * @param {mongoose.Model} Model - The mongoose model to seed
   * @param {Array} data - Array of objects to seed
   * @param {Object} options - Seeding options
   * @param {boolean} options.clearBefore - Whether to clear existing data before seeding
   * @param {boolean} options.skipDuplicates - Whether to skip duplicates based on unique fields
   * @returns {Promise<Array>} Array of seeded documents
   */
  static async seed(Model, data, options = {}) {
    const { clearBefore = false, skipDuplicates = true } = options;

    try {
      // Clear existing data if requested
      if (clearBefore) {
        await Model.deleteMany({});
        console.log(`Cleared existing data from ${Model.modelName}`);
      }

      if (skipDuplicates) {
        // Get unique fields from schema
        const uniqueFields = Object.keys(Model.schema.paths).filter(
          path => Model.schema.paths[path].options.unique
        );

        // If there are unique fields, handle duplicates
        if (uniqueFields.length > 0) {
          const seededDocs = [];

          for (const item of data) {
            // Build query to check for duplicates
            const query = uniqueFields.reduce((acc, field) => {
              if (item[field]) {
                acc[field] = item[field];
              }
              return acc;
            }, {});

            // Skip if duplicate found
            const exists = await Model.findOne(query);
            if (!exists) {
              const doc = await Model.create(item);
              seededDocs.push(doc);
            }
          }

          console.log(`Seeded ${seededDocs.length} documents to ${Model.modelName}`);
          return seededDocs;
        }
      }

      // If no unique fields or skipDuplicates is false, insert all
      const docs = await Model.insertMany(data);
      console.log(`Seeded ${docs.length} documents to ${Model.modelName}`);
      return docs;

    } catch (error) {
      console.error(`Error seeding ${Model.modelName}:`, error);
      throw error;
    }
  }
}

module.exports = Seeder; 