// 'use strict'
//
// exports.handle = function handle(client) {
//
//   const sayHello = client.createStep({
//     satisfied() {
//       return Boolean(client.getConversationState().helloSent)
//     },
//
//     prompt() {
//       client.addResponse('app:response:name:welcome')
//       client.addResponse('app:response:name:provide/documentation', {
//         documentation_link: 'http://docs.init.ai',
//       })
//       client.addResponse('app:response:name:provide/instructions')
//       client.updateConversationState({
//         helloSent: true
//       })
//       client.done()
//     }
//   })
//
//   // Steps
//   const handleGreeting = client.createStep({
//       satisfied() {
//           return false
//       },
//
//       prompt() {
//           client.addTextResponse('Hello world, I mean human')
//           client.done()
//       }
//   })
//
//   const handleGoodbye = client.createStep({
//       satisfied() {
//           return false
//       },
//
//       prompt() {
//           client.addTextResponse('See you later!')
//           client.done
//       }
//   })
//
//   const whatIsHackCes = client.createStep({
//       satisfied() {
//           return false
//       },
//
//       prompt() {
//           client.addTextResponse('Hello! Hack CES is ____')
//           client.done
//       }
//   })
//
//   const getEmail = client.createStep({
//       satisfied() {
//           return false
//       },
//
//       prompt() {
//           client.addTextResponse('We are excited that you are interested! Could we please get your email to follow up?')
//           client.done
//       }
//   })
//
//   // Flow
//   client.runFlow({
//     classifications: {
//         greeting: 'greeting',
//     },
//     autoResponses: {
//       // configure responses to be automatically sent as predicted by the machine learning model
//     },
//     streams: {
//       greeting: whatIsHackCes,
//       goodbye: handleGoodbye,
//       main: 'onboarding',
//       onboarding: [sayHello],
//     }
//   })
// }


'use strict'

exports.handle = function handle(client) {
  const sayHello = client.createStep({
        satisfied() {
          return false
        },

      prompt() {
          client.addTextResponse('Hello world, I mean human')
          client.done()
      }
  })

  const handleEvent = function(eventType, payload) {
    console.log('received event of type', eventType, 'with payload:', payload)
    client.addTextResponse('Received event of type: ' + eventType)
    client.done()
  }

  console.log('Received message:', client.getMessagePart())

  client.runFlow({
    eventHandlers: {
      '*': handleEvent
    },
    streams: {
      main: 'hi',
      hi: [sayHello],
    }
  })
}
