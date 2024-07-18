const latex = require('node-latex');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');

const writeFilePromise = promisify(fs.writeFile);

// Personal detail
const personalDetailCreator = (data) => {
    if (!data) return '';

    const template = `
    \\begin{center}
    \\textbf{\\Huge \\scshape ${formatter(data.firstName)} ${formatter(data.lastName)}} \\\\ \\vspace{1pt}
    \\small ${formatter(data.phoneNo)} $|$ \\href{mailto:x@x.com}{\\underline{${formatter(data.email)}}} $|$ 
    \\href{${formatter(data.linkedin)}}{\\underline{linkedin.com}} $|$
    \\href{${formatter(data.github)}}{\\underline{github.com}}
    \\end{center}
    `;
    return template;
};

// Education
const educationCreator = (data) => {
    if (!data || data.length === 0) return '';

    const info = data.map(val =>
        `\\resumeSubheading{${formatter(val.cllgName)}}{${formatter(val.location)}}{${formatter(val.course)}}{${formatter(val.year)}}`
    ).join('\n');

    const template = `
    \\section{Education}
    \\resumeSubHeadingListStart
      ${info}
    \\resumeSubHeadingListEnd
    `;
    return template;
};

// Projects
const projectsSection = (data) => {
    if (!data || data.length === 0) return '';

    const projects = data.map(project => {
        const points = project.points.map(point => `\\resumeItem{${formatter(point)}}`).join('\n');
        return `
        \\resumeProjectHeading{\\textbf{${formatter(project.projectName)}} $|$ \\emph{${formatter(project.tech)}}}{\\href{${formatter(project.link)}}{\\underline{link}}}
          \\resumeItemListStart
            ${points}
          \\resumeItemListEnd
        `;
    }).join('\n');

    const template = `
    \\section{Projects}
    \\resumeSubHeadingListStart
      ${projects}
    \\resumeSubHeadingListEnd
    `;
    return template;
};

// Experience
const experienceCreator = (data) => {
    if (!data || data.length === 0) return '';

    const experiences = data.map(exp => {
        const points = exp.points.map(point => `\\resumeItem{${formatter(point)}}`).join('\n');
        return `
        \\resumeSubheading{${formatter(exp.company)} | ${formatter(exp.role)}}{${formatter(exp.date)}}{${formatter(exp.location)}}{}
          \\resumeItemListStart
            ${points}
          \\resumeItemListEnd
        `;
    }).join('\n');

    const template = `
    \\section{Experiences}
    \\resumeSubHeadingListStart
      ${experiences}
    \\resumeSubHeadingListEnd
    `;
    return template;
};

// Achievements
const achievementCreator = (data) => {
    if (!data || data.length === 0) return '';

    const achievements = data.map(ach => {
        const points = ach.points.map(point => `\\resumeItem{${formatter(point)}}`).join('\n');
        return `
        \\resumeProjectHeading{\\textbf{${formatter(ach.name)}}}{}
          \\resumeItemListStart
            ${points}
          \\resumeItemListEnd
        `;
    }).join('\n');

    const template = `
    \\section{Achievement}
    \\resumeSubHeadingListStart
      ${achievements}
    \\resumeSubHeadingListEnd
    `;
    return template;
};

// Skills
const skillsCreator = (data) => {
    if (!data || data.length === 0) return '';

    const skills = data.map(skill => `\\textbf{${formatter(skill.skillName)}}{: ${formatter(skill.skillValue)}} \\\\`).join('\n');

    const template = `
    \\section{Technical Skills}
    \\begin{itemize}[leftmargin=0.15in, label={}]
      \\small{\\item{
        ${skills}
      }}
    \\end{itemize}
    `;
    return template;
};

// Create .tex file
const createTexFile = async (data) => {
    try {
        const uuid = uuidv4();
        await writeFilePromise(`./temp/${uuid}.tex`, data);
        console.log('File created and data written successfully.');
        return { status: 'Success', id: uuid };
    } catch (error) {
        console.error('Error creating/writing to file:', error);
        throw error;
    }
};

// Create PDF from .tex file
const createPdfPromise = (id) => {
    return new Promise((resolve, reject) => {
        const input = fs.createReadStream(`./temp/${id}.tex`);
        const output = fs.createWriteStream(`./pdfFiles/${id}.pdf`);
        const pdf = latex(input);

        pdf.pipe(output);
        pdf.on('error', err => {
            console.error(err);
            reject(err);
        });
        pdf.on('finish', () => {
            console.log('PDF generated!');
            resolve('success');
        });
    });
};

const createPdfAsync = async (id) => {
    try {
        await createPdfPromise(id);
        console.log('File created and data written successfully.');
        return { success: true };
    } catch (error) {
        console.error('Error creating/writing to file:', error);
        throw error;
    }
};

// Check if file exists
const isFileExists = (path) => {
    return new Promise((resolve) => {
        fs.access(path, fs.constants.F_OK, (err) => {
            if (err) {
                console.error('File does not exist.');
                resolve(false);
            } else {
                console.log('File exists.');
                resolve(true);
            }
        });
    });
};

const isFileExistsAsync = async (path) => {
    try {
        return await isFileExists(path);
    } catch (error) {
        throw error;
    }
};

// Formatter for LaTeX special characters
const formatter = (val) => {
    if (!val) return '';

    let updatedStr = val;
    const targetChars = ['\\', '%', '$', '#', '_', '{', '}', '~', '^', '&'];

    targetChars.forEach(char => {
        updatedStr = updatedStr.replace(new RegExp(`\\${char}`, 'g'), `\\${char}`);
    });

    return updatedStr;
};

module.exports = {
    personalDetailCreator,
    educationCreator,
    projectsSection,
    experienceCreator,
    achievementCreator,
    skillsCreator,
    createTexFile,
    createPdfAsync,
    isFileExistsAsync
};
