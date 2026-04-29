const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
require('dotenv').config();

const Problem = require('./models/Problem');

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected.');

        console.log('Clearing existing problems...');
        await Problem.deleteMany({});
        console.log('Cleared existing problems.');

        const results = [];
        const csvPath = path.join(__dirname, '../datasets/problems.csv');

        console.log('Parsing CSV/TSV file...');
        
        fs.createReadStream(csvPath)
            .pipe(csv({ separator: '\t' }))
            .on('data', (data) => {
                const tags = data.related_topics ? data.related_topics.split(',').map(t => t.trim()) : [];
                const companies = data.companies ? data.companies.split(',').map(c => c.trim()) : [];
                
                results.push({
                    title: data.title || 'Untitled',
                    description: data.description || 'No description provided.',
                    difficulty: data.difficulty || 'Easy',
                    tags: tags,
                    acceptanceRate: parseFloat(data.acceptance_rate) || 0,
                    likes: parseInt(data.likes) || 0,
                    dislikes: parseInt(data.dislikes) || 0,
                    companies: companies,
                    isPremium: data.is_premium === '1',
                    defaultCode: {
                        python: 'def solve():\n    # Write your code here\n    pass',
                        java: 'class Solution {\n    public void solve() {\n        // Write your code here\n    }\n}',
                        cpp: 'class Solution {\npublic:\n    void solve() {\n        // Write your code here\n    }\n};',
                        c: 'void solve(){\n    // Write your code here\n}'
                    },
                    testCases: [{ input: 'N/A', expectedOutput: 'N/A' }]
                });
            })
            .on('end', async () => {
                console.log(`Parsed ${results.length} problems. Inserting into database in batches...`);
                
                const BATCH_SIZE = 1000;
                for (let i = 0; i < results.length; i += BATCH_SIZE) {
                    const batch = results.slice(i, i + BATCH_SIZE);
                    await Problem.insertMany(batch);
                    console.log(`Inserted batch ${i / BATCH_SIZE + 1} (${batch.length} problems)`);
                }
                
                console.log('Seeding complete!');
                process.exit(0);
            })
            .on('error', (err) => {
                console.error('Error reading CSV:', err);
                process.exit(1);
            });

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
