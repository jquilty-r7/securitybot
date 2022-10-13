let signingSecret = process.env.SlackSigning;
let botToken = process.env.SlackBot;

const { App, AwsLambdaReceiver } = require('@slack/bolt');

const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: signingSecret,
});

const app = new App({
    token: botToken,
    receiver: awsLambdaReceiver,
    processBeforeResponse: true
});

app.event('app_home_opened', async({event, client, logger}) =>{
    

try{
	const result = await client.views.publish({
		user_id: event.user,
		view:{
			"type":"home",
			"blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": ":lock:  Ask Security  :lock:"
			}
		},
		{
			"type": "context",
			"elements": [
				{
					"text": "Find common contacts in InfoSec",
					"type": "mrkdwn"
				}
			]
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": " :card_index_dividers: *Initiate Process* :card_index_dividers:"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "I need a Vendor Assessment"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Start Process",
					"emoji": true
				},
				"style": "primary",
                "action_id": "vendor"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "I want to report a potential security incident"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Notify RAPIDFire",
					"emoji": true
				}
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "A customer wants information about a Rapid7 security policy"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Create SSR",
					"emoji": true
				}
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": " :loud_sound: *Contact Security* :loud_sound:"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "I'm looking to contact Security Engineering"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "@SecEng",
					"emoji": true
				}
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "I'm looking to contact Trust & Governance"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "@IS-T&G",
					"emoji": true
				},
				"style": "primary",
                "action_id": "IS"
			},
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "I'm looking to contact Security Operations"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "@SecOps",
					"emoji": true
				}
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "I'm looking to contact Application Security"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "@AppSec",
					"emoji": true
				}
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "I don't know who to contact for my question"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Ask SecurityBot",
					"emoji": true
				}
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": ":pushpin: Have suggestions for improving this App? Please see *the documentation* for dev team contact info."
							}
						]
					}
				]
			}
		});
		logger.info(result);
	}
	catch(error){
		logger.error(error)
	}
});

app.action('IS', async ({ack, body, client, logger, respond}) => {
    try{
        await ack();
        const result = await client.chat.postMessage({
      channel: body.user.id,
      text: 'loser LOL'
    });
    
        console.log('Body: ' + body);
    }
    catch (error){
        logger.error(error)
    }
});

app.action('vendor', async({ack, body, client, logger}) => {
   try{
       await ack();
       const result = await client.chat.postMessage({
           channel: body.user.id,
           text: `Hey <@${body.user.username}> if you would like to submit a request for a vendor assement follow the instructions <https://rapid7.samanage.com/catalog_items/1141674-vendor-assessment-request/service_requests/new.portal|here>`
       });
       
        console.log('Body' + body)
   } 
   catch(error){
       logger.error(error)
   }
});


app.message('spam', async ({ message, say }) => {
    await say({
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `Stop spamming me <@${message.user}>!`
                },
                "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Click Me"
                    },
                    "action_id": "send"
                }
            }
        ],
        text: `Stop spamming me <@${message.user}>!`
    });

});

app.command('/ask-security', async ({ack, say }) => {
  // Acknowledge command request
  await ack();
  await say('LOL get wrecked NERD');
});

app.action('send', async ({ body, message, ack, say }) => {
    await ack();
    await say(`<@${body.user.id}> clicked the button`);
    console.log('Body: ' + body);
});


app.action('cancel', async ({ ack, say}) => {
    await ack();
    await say('No problem! :thumbsup:')
});

app.message('goodbye', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say(`See ya later, <@${message.user}> :wave:`);
});

app.message(/(duo)/i, async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    try{
        await say({text:`Shutup and go to IT, <@${message.user}> :middle_finger::skin-tone-4:`,thread_ts: message.thread_ts || message.ts});
    }catch (error){
        console.log("err")
        console.error(error);
    }
});

app.command('/securityhelp', async ({ack, body, client}) => {
    await ack();

    try {
        const result = await client.views.open({
            trigger_id: body.trigger_id,
            view: {
                type: 'modal',
                callback_id: 'securityPrompt',
                title: {
                    type: 'plain_text',
                    text: 'SecurityBot'
                },
                blocks: [
                    {
                        "type": "context",
                        "elements": [
                            {
                                "type": "mrkdwn",
                                "text": "This is a SecurityBot modal prompt. *Wow!*"
                            }
                        ]
                    },
                    {
                        "type": "input",
                        "block_id": "input_c",
                        "label": {
                            "type": "plain_text",
                            "text": "Tell us about yourself"
                        },
                        "element": {
                            "type": "plain_text_input",
                            "action_id": "dreamy_input",
                            "multiline": true
                        }
                    }
                ],
                submit: {
                    type: 'plain_text',
                    text: 'Submit'
                }
            }
        });
        console.log(result);
    }
    catch (error){
        console.log(error)
    }
});

module.exports.InvokeSecurityBot = async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start();
    console.log(event)
    return handler(event, context, callback);
};