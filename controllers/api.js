const { personalDetailCreator, educationCreator, projectsSection, experienceCreator, achievementCreator, skillsCreator, createTexFile, createPdfAsync, isFileExistsAsync } = require('../util/util');
const { latexHeader } = require('../util/constant');
const path = require('path');

const createPdf = async (req, res) => {
    let { data } = req.body;

    let personalDetail = personalDetailCreator(data['personalDetail']);
    let education = educationCreator(data['education']);
    let experience = experienceCreator(data['experience']);
    let project = projectsSection(data['projects']);
    let achievement = achievementCreator(data['achievements']);
    let skills = skillsCreator(data['skills']);

    let template =
        `${latexHeader}
        \\begin{document}
        ${personalDetail}
        ${education}
        ${experience}
        ${project}
        ${achievement}
        ${skills}
        \\end{document}`;

    try {
        const response = await createTexFile(template);
        const status = await createPdfAsync(response?.id);
        if (status.success) {
            console.log(`file-id : ${response.id}`);
            return res.json({ status: 'success', id: response.id });
        }
    } catch (error) {
        console.log(error);
        return res.send({ msg: "something went wrong, try again later", status: 'failure' });
    }
};

const getFile = async (req, res) => {
    try {
        const { id } = req.query;
        if (id == null || id == undefined) {
            return res.json({ status: 'failure', msg: 'id missing or invalid' });
        }
        const filePath = path.resolve(__dirname, '..', 'pdfFiles', `${id}.pdf`);
        const isFileExist = await isFileExistsAsync(filePath);

        if (isFileExist) {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=your-file.pdf');
            res.sendFile(filePath);
        } else {
            res.send({ msg: "something went wrong, try again later", status: 'failure' });
        }
    } catch (error) {
        res.send({ msg: "something went wrong, try again later", status: 'failure' });
        console.log(error);
    }
};

module.exports = {
    createPdf,
    getFile
};
