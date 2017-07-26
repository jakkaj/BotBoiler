
import test, { TestContext } from 'ava';
import * as builder from 'botbuilder';
import * as sinon from 'sinon';

import { testBase } from '../testBase';

import * as contracts from "../../src/system/contract/contracts";

class testDynamicDialog extends testBase{
    
    constructor() {
        super();        
    }

    test_getEntity_sendsSay(t:TestContext){
        var dialog = this.resolveDialog<contracts.IDialog>('dataDialog');
        t.truthy(dialog);

        var dialogData = this.getTestDialogData();        
        var result = dialog.init(dialogData);

        var args = this.getArgsWithEntity();

        var func = dialog.waterfall[0];

        t.truthy(func);

        var next = sinon.spy();
        var textSpy = sinon.spy(builder.Prompts, 'text');
        //var sessionStub = sinon.createStubInstance(MyConstructor) ;
        var session: builder.Session = sinon.createStubInstance(builder.Session);
        var sendSpy:sinon.SinonSpy = session.send as sinon.SinonSpy;

        func(session, args, next);
        textSpy.restore();

        t.true(sendSpy.calledOnce);
        t.true(sendSpy.calledWith(dialogData.initialSay));

    }

    test_validates(t: TestContext) {
        var dialog = this.resolveDialog<contracts.IDialog>('dataDialog');
        t.truthy(dialog);

        var dialogData = this.getTestDialogData();
        
        var result = dialog.init(dialogData);

        t.false(result);     
        
        //test to ensure validation fails for id
        var dialog2 = this.resolveDialog<contracts.IDialog>('dataDialog');
        
        var dialogData2 = this.getTestDialogData();
        
        dialogData2.id = null;
        
        var result2 = dialog2.init(dialogData2);

        t.true(result2);     
    }

    getArgsWithEntity():any{
        var args = { "action": "*:luisDialog", "intent": { "score": 0.901591837, "intent": "SubmitTicket", "intents": [{ "intent": "SubmitTicket", "score": 0.901591837 }, { "intent": "HandOffToHuman", "score": 0.127539277 }, { "intent": "ExploreKnowledgeBase", "score": 0.0437066928 }, { "intent": "None", "score": 0.02504362 }, { "intent": "Help", "score": 0.01835419 }], "entities": [{ "entity": "networking", "type": "category", "startIndex": 24, "endIndex": 33, "resolution": { "values": ["networking"] } }] }, "libraryName": "*" }
        return args;
    }

    getArgsWithNoEntity():any{
        var args = {
            "action": "*:luisDialog", "intent": {
                "score": 0.3312974, "intent": "SubmitTicket", "intents": [{
                    "intent"
                    : "SubmitTicket", "score": 0.3312974
                }, { "intent": "HandOffToHuman", "score": 0.154576644 },
                { "intent": "ExploreKnowledgeBase", "score": 0.0538623519 },
                { "intent": "Help", "score": 0.03384778 }, { "intent": "None", "score": 0.0298019145 }], "entities": []
            }, "libraryName": "*"
        }
        return args;
    }

    getTestDialogData():contracts.graphDialog{

        var fields: contracts.dialogField[] = [{
            luisEntityName: 'category',
            promptText: 'Please enter a category'
        }];

        var d:contracts.dialogData = {
            fields:fields
        }

        var graphDialog:contracts.graphDialog = {
            isLuis: true,
            triggerText: 'SubmitTicket',
            id: 'submitTicketDialog',
            data: d,
            initialSay: 'Okay! So you want to submit a ticket hey?'
        }

        return graphDialog;

    }
}

var testClass = new testDynamicDialog();

test(testClass.test_validates.bind(testClass));
test(testClass.test_getEntity_sendsSay.bind(testClass));