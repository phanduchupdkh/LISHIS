require('dotenv').config()
var hl7 = require('simple-hl7')
const { MongoClient } = require('mongodb')
const { v4: uuidv4 } = require('uuid')
const token = process.env.REMOTE_LIS_TOKEN
const urlCl3 = process.env.REMOTE_SERVER_CL3_URI
const moment = require('moment')
const Axios = require('axios')

// Connection URL

const url = 'mongodb://localhost:27017';
let databaseName = 'testLIS'

const client = new MongoClient(url)
///////////////////SERVER/////////////////////
var app = hl7.tcp()

app.use(async function (req, res) {
  //req.msg is the HL7 message
  console.log('******message received*****')
  // console.log(req.msg)
  await client.connect()
  console.log('🌱  Database seeder is running')
  const db = client.db('lisServer')
  // MSH|a|
  // PID||||||||||
  // OBX|||||||||||
  // OBR|||||||||||
  try {
    let arrayReqLis = req.msg.log().split('\n')
    let MSH = {}
    let PID = {}
    let OBR = {}
    let OBX = {}

    arrayReqLis.forEach(li => {
      let detailLi = li.split('|')
      if (detailLi[0] === 'MSH') {
        let [
          fieldSeparator,
          encodingCharacters,
          sendingApplication,
          sendingFacility,
          receivingApplication,
          receivingFacility,
          dateTimeOfMessage,
          security,
          messageType,
          messageControlId,
          processingId,
          versionId,
          sequenceNumber,
          continuationPointer,
          acceptAcknowledgementType,
          applicationAcknowledgementType,
          countryCode,
          characterSet,
          principalLanguageOfMessage,
          alternateCharacterSetHandlingScheme
        ] = detailLi
        MSH = {
          fieldSeparator,
          encodingCharacters,
          sendingApplication,
          sendingFacility,
          receivingApplication,
          receivingFacility,
          dateTimeOfMessage:moment(dateTimeOfMessage, 'YYYYMMDDHHmmss').valueOf()|| 0,
          security,
          messageType,
          messageControlId,
          processingId,
          versionId,
          sequenceNumber,
          continuationPointer,
          acceptAcknowledgementType,
          applicationAcknowledgementType,
          countryCode,
          characterSet,
          principalLanguageOfMessage,
          alternateCharacterSetHandlingScheme
        }
      }
      if (detailLi[0] === 'PID') {
        let [
          ,
          setIDPatientID,
          patientIDExternalID,
          patientIDInternalID,
          alternatePatientIDPID,
          patientName,
          motherMaidenName,
          dateOfBirth,
          sex,
          patientAlias,
          countryCode,
          phoneNumberHome,
          phoneNumberBusiness,
          primaryLanguage,
          maritalStatus,
          religion,
          patientAccountNumber,
          SSNNumberPatient,
          driversLicenseNumberPatientt,
          motherIdentifier,
          ethnicGroup,
          birthPlace,
          multipleBirthIndicator,
          birthOrder,
          citizenship,
          veteransMilitaryStatus,
          nationality,
          patientDeathDateandTime,
          patientDeathIndicator
        ] = detailLi

        PID = {
          setIDPatientID,
          patientIDExternalID,
          patientIDInternalID,
          alternatePatientIDPID,
          patientName,
          motherMaidenName,
          dateOfBirth,
          sex,
          patientAlias,
          countryCode,
          phoneNumberHome,
          phoneNumberBusiness,
          primaryLanguage,
          maritalStatus,
          religion,
          patientAccountNumber,
          SSNNumberPatient,
          driversLicenseNumberPatientt,
          motherIdentifier,
          ethnicGroup,
          birthPlace,
          multipleBirthIndicator,
          birthOrder,
          citizenship,
          veteransMilitaryStatus,
          nationality,
          patientDeathDateandTime: moment(patientDeathDateandTime, 'YYYYMMDDHHmmss').valueOf()|| 0,
          patientDeathIndicator
        }
      }
      if (detailLi[0] === 'OBR') {
        let [
          ,
          setIDOBR,
          placerOrderNumber,
          fillerOrderNumber,
          universalServiceIdentifier,
          priority,
          requestedDateTime,
          observationDateTime,
          observationEndDateTime,
          collectionVolume,
          collectorIdentifier,
          specimenActionCode,
          dangerCode,
          relevantClinicalInformation,
          specimenReceivedDateTime,
          specimenSource,
          orderingProvider,
          orderCallbackPhoneNumber,
          placerField1,
          placerField2,
          fillerField1,
          fillerField2,
          resultsRptStatusChngDateTime,
          chargeToPractice,
          diagnosticServSectID,
          resultStatus,
          parentResult,
          quantityTiming,
          resultCopiesTo,
          parentNumber,
          transportationMode,
          reasonForStudy,
          principalResultInterpreter,
          assistantResultInterpreter,
          technician,
          transcriptionist,
          scheduledDateTime,
          numberOfSampleContainers,
          transportLogisticsOfCollectedSample,
          collectorComment,
          transportArrangementResponsibility,
          transportArranged,
          escortRequired,
          plannedPatientTransportComment,
          procedureCode,
          procedureCodeModifier
        ] = detailLi

        OBR = {
          setIDOBR,
          placerOrderNumber,
          fillerOrderNumber,
          universalServiceIdentifier,
          priority,
          requestedDateTime:moment(requestedDateTime, 'YYYYMMDDHHmmss').valueOf()|| 0,
          observationDateTime:moment(observationDateTime, 'YYYYMMDDHHmmss').valueOf()|| 0,
          observationEndDateTime:moment(observationEndDateTime, 'YYYYMMDDHHmmss').valueOf()|| 0,
          collectionVolume,
          collectorIdentifier,
          specimenActionCode,
          dangerCode,
          relevantClinicalInformation,
          specimenReceivedDateTime:moment(specimenReceivedDateTime, 'YYYYMMDDHHmmss').valueOf()|| 0,
          specimenSource,
          orderingProvider,
          orderCallbackPhoneNumber,
          placerField1,
          placerField2,
          fillerField1,
          fillerField2,
          resultsRptStatusChngDateTime:moment(resultsRptStatusChngDateTime, 'YYYYMMDDHHmmss').valueOf()|| 0,
          chargeToPractice,
          diagnosticServSectID,
          resultStatus,
          parentResult,
          quantityTiming,
          resultCopiesTo,
          parentNumber,
          transportationMode,
          reasonForStudy,
          principalResultInterpreter,
          assistantResultInterpreter,
          technician,
          transcriptionist,
          scheduledDateTime,
          numberOfSampleContainers,
          transportLogisticsOfCollectedSample,
          collectorComment,
          transportArrangementResponsibility,
          transportArranged,
          escortRequired,
          plannedPatientTransportComment,
          procedureCode,
          procedureCodeModifier
        }
      }

      if (detailLi[0] === 'OBX') {
        let [
          ,
          setIDOBX,
          valueType,
          observationIdentifier,
          observationSubId,
          observationValue,
          units,
          referenceRange,
          abnormalFlags,
          probability,
          natureOfAbnormalTest,
          observResultStatus,
          dataLastObsNormalValues,
          userDefinedAccessChecks,
          dateTimeOfTheObservation,
          producerId,
          responsibleObserver,
          observationMethod
        ] = detailLi

        OBX = {
          setIDOBX,
          valueType,
          observationIdentifier,
          observationSubId,
          observationValue,
          units,
          referenceRange,
          abnormalFlags,
          probability,
          natureOfAbnormalTest,
          observResultStatus,
          dataLastObsNormalValues,
          userDefinedAccessChecks,
          dateTimeOfTheObservation:moment(dateTimeOfTheObservation, 'YYYYMMDDHHmmss').valueOf()|| 0,
          producerId,
          responsibleObserver,
          observationMethod
        }
      }
    })
    const cli_create_test_result = {
      query: `
        mutation createTestResultFromLis ($MSH: MSHInput!, $PID: PIDInput!, $OBR: OBRInput!, $OBX: OBXInput!) {
          createTestResultFromLis(MSH: $MSH, PID: $PID, OBR: $OBR, OBX: $OBX)
        }
      `,
      variables: {
        MSH,
        PID,
        OBR,
        OBX
      }
    }
    
    let t = await db.collection(databaseName).findOne({ messageFull: req.msg.log() })
    if (!t) {
      try {
        let a = await Axios.post(urlCl3, cli_create_test_result, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'access-token': token
          }
        })
        console.log(a.data)
      } catch (error) {
        console.log(error)
      }
      
      await db.collection(databaseName).findOneAndUpdate(
        { messageFull: req.msg.log() },
        {
          $set: {
            messageFull: req.msg.log(),
            MSH,
            PID,
            OBR,
            OBX,
            isActive: true,
            createdAt: +new Date(),
            createdBy: {
              _id: '0',
              username: 'admin',
              fullName: 'Administrator'
            }
          }
        },
        { upsert: true }
      )
    }

    var msa = res.ack.getSegment('MSA');
    msa.setField(1, 'AA')
    msa.setField(2, MSH.messageControlId)
    res.end()

  } catch (err) {
    console.log(err)
  }
  console.log('💤  Server off   ')
})
// Listen on port 7777
app.start(7777)
///////////////////SERVER/////////////////////
