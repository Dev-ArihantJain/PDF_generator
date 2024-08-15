const fs = require('fs');
const puppeteer = require('puppeteer');
const Handlebars = require('handlebars');

// Load HTML Template
const templateHtml = fs.readFileSync('./byhtml.html', 'utf8'); 
// Compile Template
const template = Handlebars.compile(templateHtml);

// Sample Student Data
const studentData = {
    name: ' student names ',
    class: 'class here',
    rollNo: 'roll no here',
    academicYear: '2023-2024',
    subjects: [
        { name: 'Mathematics', marks: 92, grade: 'A+' },
        { name: 'Science', marks: 88, grade: 'A' },
        { name: 'English', marks: 85, grade: 'A' },
        { name: 'Social Studies', marks: 90, grade: 'A+' },
        { name: 'Physical Education', marks: 95, grade: 'A+' },
    ],
    totalMarks: 450,
    percentage: 90,
    overallGrade: 'A+',
};

// Fill Template with Data
const filledHtml = template(studentData);

// Generate PDF
(async () => {
    const browser = await puppeteer.launch(
        {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            tiimeout: 160000,
        }
    );
    const page = await browser.newPage();

    // Set HTML content
    await page.setContent(filledHtml, { waitUntil: 'domcontentloaded', timeout: 160000 });

    // Create PDF
    try{

        await page.pdf({
            path: `${studentData.name}output_report_card.pdf`,
            format: 'A4',
            printBackground: true,
            timeout: 160000,
        });
    }
    catch(err){
        console.log(err);
    }

    await browser.close();
    console.log('PDF generated successfully!');
})();

