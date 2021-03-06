import React, { useEffect, useState } from 'react';
//import request from 'utils/Request'; TODO refactor to remove burden from ProtPlot.js
import axios from 'axios';
import UploadFile from './UploadFile';
import AccordionSetup from './AccordionSetup';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Button, Checkbox, Divider, FormControlLabel, TextField, Typography } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Route, useHistory } from 'react-router';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';


//TODO: change color palette (Eg. 191D32, 7f7f7f, 423B0B, D000000, FFBA08[replace with mustard yellow?])
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    button: {
        padding: theme.spacing(1),
        textAlign: 'center',
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    divider: {
        scale: 1.5,
        backgroundColor: 'black',
        
    }
}));

//generates random id;
let guid = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return s4() + s4() + '_' + s4() + '_' + s4() + '_' + s4() + '_' + s4() + s4() + s4();
}

function ProtPlot() {
    //temp for production
    function getImages() {
        history.push('/view-results/' + textFields.uidTextField);
      }
    //end of temp
    const classes = useStyles();
    const resultID = guid();
    const history = useHistory()

    const [fastaFile, setFastaFile] = useState(null);
    let fileReader;

    const [checkboxes, setCheckboxes] = useState({
        absoluteResultsCheckbox: false,
        fastaFileLoadedCheckbox: false,
    });
    const handleCheckBox = (event) => {
        setCheckboxes({ ...checkboxes, [event.target.name]: event.target.checked });
    };

    const [textFields, setTextFields] = useState({
        cutoffTextField: '0.05',
        maxCutoffTextField: '0.05',
        scaleFigureTextField: '1',
    });
    const handleTextField = (event) => {
        setTextFields({ ...textFields, [event.target.name]: event.target.value })
    }

    function uploadTestFastaFile() {
        //TODO change this - set fastafile to "test" and fix in views.py
        setFastaFile({
            file: "test",
            name: "test"
        })
    }
    function clearFastaFile() {
        setFastaFile(null);
    }
    const handleFileRead = (e) => {
        const content = fileReader.result;
        //TODO Validate file content
        console.log(content)
    }
    function handleFastaFile(file) {
        //Validate fastaFile:
        let valid = true;
        if (((file.size / 1024) / 1024).toFixed(4) > 10) {
            alert("Your fasta file is greater than 10mb, which is the maximum allowed size.")
            valid = false;
        }
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);

        if (valid) {
            setFastaFile(file);
            alert("Sucessfully uploaded file: " + file.name)
        }
        else {
            alert("Your fasta file is not in a valid format, please try again with a different file.")
        }
    }

    async function sendPartOneFiles() {
        //Save file to server so the backend can access it 
        const data = new FormData();

        if (fastaFile == null) {
            alert("Please upload a file before clicking go.");
            return;
        }
        if (fastaFile.name === "test") {
            data.append(resultID, fastaFile.name)
        }
        else {
            data.append(resultID, fastaFile, fastaFile.name);
        }


        if (checkboxes.absoluteResultsCheckbox) {
            data.append('absoluteResults', checkboxes.absoluteResultsCheckbox);
        }
        else {
            data.append('absoluteResults', checkboxes.absoluteResultsCheckbox);
        }
        if (textFields.cutoffTextField !== '') {
            if (parseFloat(textFields.cutoffTextField) < 0 || parseFloat(textFields.cutoffTextField) > 1) {
                alert("Please enter a valid minimum domain prevalence value, or remove it.");
                return;
            }
            else {
                data.append('cutoff', parseFloat(textFields.cutoffTextField));
            }
        }
        if (textFields.maxCutoffTextField !== '') {
            if (parseFloat(textFields.maxCutoffTextField) < 0 || parseFloat(textFields.maxCutoffTextField) > 1) {
                alert("Please enter a valid minimum domain position conservation value, or remove it.");
                return;
            }
            else {
                data.append('maxCutoff', parseFloat(textFields.maxCutoffTextField));
            }
        }
        if (textFields.scaleFigureTextField !== '') {
            if (parseFloat(textFields.scaleFigureTextField) < 0) {
                alert("Please enter a valid figure scaling value.");
                return;
            }
            else {
                data.append('scaleFigure', parseFloat(textFields.scaleFigureTextField));
            }
        }

        await axios.post('/api/sendfiles', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then(response => {
            console.log(response);
            textFields.scaleFigureTextField = '';
            textFields.maxCutoffTextField = '';
            textFields.cutoffTextField = '';
            checkboxes.absoluteResultsCheckbox = false;
            history.push("/view-results/" + resultID);
        }).catch(error => {
            console.log(error);
        });
    }

    return (
        <div className='protplot'>
            <div>
                <Grid container spacing={3} alignItems='center' justify='center'>
                    <Grid item xs={12}>
                        <Paper className={classes.paper} variant='outlined' style={{ marginTop: "90px" }}>Use DomainViz by first uploading your fasta file, and then adding options if desired, and finally press the Send Task button!</Paper>
                    </Grid>

                    <Grid item xs={3}>
                        <AccordionSetup id='fastatxt' header='Fasta File' body='The file needs to contain fasta sequences in files named either .fa or .fasta.'></AccordionSetup>
                    </Grid>
                    <Grid item xs={1}/>
                    <Grid item xs={1}>
                        <UploadFile value='fasta' handleFile={handleFastaFile} acceptedTypes='.fa,.fasta' />
                        <Button variant='contained' color='default' component='span' className={classes.button} onClick={uploadTestFastaFile} style={{marginTop: "10px"}}>Load Example</Button>
                        <Button variant='contained' color='default' component='span' className={classes.button} onClick={clearFastaFile} style={{marginTop: "10px"}}>Clear File</Button>

                    </Grid>
                    <Grid item xs={1}>
                        <Checkbox disabled style={{color: 'green'}} checked={(fastaFile==null) ? false : true} name="fastaFileLoadedCheckbox"/>
                    </Grid>
                    <Grid item xs={4}/>

                    <Grid item xs={12}/>
                    <Grid item xs={12}/>


                    <Grid item xs={3}>
                        <AccordionSetup id='cutofftxt' header='Minimum domain prevalence' body='Enter a number between 0 and 1. The default value is 0.05. Only domains occuring in a ratio higher than the number are plotted (e.g. If the value is 0.5, the domain has to occur somewhere in the protein of at least 50% of sequences).'></AccordionSetup>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField id='cutoff' name='cutoffTextField' value={textFields.cutoffTextField} type='number' inputProps={{ step: '0.1', max: 1, min: 0 }} onChange={handleTextField} />
                    </Grid>

                    <Grid item xs={3}>
                        <AccordionSetup id='max-cutofftxt' header='Minimum domain position conservation' body='Enter a number between 0 and 1. The default value is 0.05. Only domains that have a maximum prevalence at a relative place in the protein group above this ratio are plotted (e.g. if value is 0.5, 50% of the sequences have to have this domain at the same relative position).'></AccordionSetup>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField id='max-cutoff' name='maxCutoffTextField' value={textFields.maxCutoffTextField} type='number' inputProps={{ step: '0.1', max: 1, min: 0 }} onChange={handleTextField} />
                    </Grid>

                    <Grid item xs={3}>
                        <AccordionSetup id='scale-figuretxt' header='Figure Scaling' body='Enter a number larger than 0. The default value is 1. The number you input represents the number of inches per 100pb that the plot is used to display.'></AccordionSetup>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField id='scale-figure' name='scaleFigureTextField' value={textFields.scaleFigureTextField} type='number' inputProps={{min: 0}} onChange={handleTextField} />
                    </Grid>

                    <Grid item xs={3}>
                        <AccordionSetup id='absoluteresultstxt' header='Absolute y-axis?' body='Click the checkbox if you want absolute results on the y-axis. The default is no. Absolute results means that we will plot absolute numbers on y axis of plots instead of relative ones. If the box is unchecked, we plot relative results, if it is checked, we plot absolute results.'></AccordionSetup>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControlLabel
                            control={<Checkbox checked={checkboxes.absoluteResultsCheckbox} onChange={handleCheckBox} name="absoluteResultsCheckbox" />}
                            label="Yes/No" />
                    </Grid>

                    <Grid item xs={12}>
                        <Button variant='contained' color='primary' component='span' className={classes.button} onClick={sendPartOneFiles}>
                            Submit Task
                        </Button>
                    </Grid>

                    <Grid item xs={6}>
                        <Divider className={classes.divider}></Divider>
                    </Grid>
                    
                    {/* temp for production */}
                    <Grid item xs={12}/>
                    <Grid item xs={12}/>
                    <Grid item xs={5}>
                        <Typography variant='body1'>Already have a code? Enter it here:</Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <TextField id='uid' name='uidTextField' value={textFields.uidTextField} label='Result ID' type="text" onChange={handleTextField} />
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant='contained' color='primary' component='span' className={classes.button} onClick={getImages}>Go to my Results</Button>
                    </Grid>
                    {/* end of temp */}
                </Grid>
            </div>
        </div>
    );
}

export default ProtPlot;
