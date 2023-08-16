const Imap = require("imap");
const { simpleParser } = require("mailparser");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// const imapConfig = {
//   user: "shit.bot.mod@gmail.com", // Replace with the email address
//   password: "hofbrlbptauawdmi", // Replace with the password of the email account
//   host: "imap.gmail.com", // Replace with the IMAP server address
//   port: 993, // Replace with the IMAP server port (usually 993 for SSL)
//   tls: true, // Use SSL/TLS connection (recommended)
//   tlsOptions: {
//     rejectUnauthorized: false, // Disable certificate verification (not recommended)
//   },
// };
async function fetchVerificationCodeFromEmail(senderEmail) {
  const imapConfig = {
    user: "doreenblac18@gmail.com", // Replace with the email address
    password: "bmvmewvurvhwptlv", // Replace with the password of the email account
    host: "imap.gmail.com", // Replace with the IMAP server address
    port: 993, // Replace with the IMAP server port (usually 993 for SSL)
    tls: true, // Use SSL/TLS connection (recommended)
    tlsOptions: {
      rejectUnauthorized: false, // Disable certificate verification (not recommended)
    },
  };
  console.log("senderEmail" + ":" + senderEmail);

  return new Promise((resolve, reject) => {
    const imap = new Imap(imapConfig);
    imap.once("ready", () => {
      imap.openBox("INBOX", true, (err, box) => {
        if (err) {
          reject(err);
          return;
        }
        const searchCriteria = [
          "UNSEEN",
          ["FROM", "Nike"],
          ["TO", senderEmail],
        ];
        // Search for unread emails from the specified email address
        imap.search(searchCriteria, async (searchErr, results) => {
          if (searchErr) {
            reject(searchErr);
            return;
          }
          if (!results || results.length === 0) {
            reject(
              new Error(
                "No unread emails found from Nike addressed to " + senderEmail
              )
            );
            return;
          }

          // Fetch the first unseen email (results[0]) in the mailbox
          const fetchOptions = {
            bodies: "",
            markSeen: true, // Set this to true if you want to mark the email as seen after processing
          };
          const fetchPromise = new Promise((resolve, reject) => {
            const f = imap.fetch(results[0], fetchOptions);
            f.on("message", (msg, seqno) => {
              let emailText = "";
              msg.on("body", (stream) => {
                stream.on("data", (chunk) => {
                  emailText += chunk.toString("utf8");
                });
              });
              msg.once("end", () => {
                // Parse the email using mailparser
                simpleParser(emailText, (err, parsed) => {
                  if (err) {
                    reject(err);
                  } else {
                    if (
                      parsed.text &&
                      parsed.text.includes("Your Nike Member profile code")
                    ) {
                      const regex = /verification code you requested: (\d+)./i;
                      const match = parsed.text.match(regex);
                      if (match && match[1]) {
                        resolve(match[1]);
                      } else {
                        reject(
                          new Error("Verification code not found in the email.")
                        );
                      }
                    } else {
                      reject(
                        new Error(
                          "Email does not contain the verification code."
                        )
                      );
                    }
                  }
                });
              });
            });
            f.once("error", (err) => {
              reject(err);
            });
          });

          try {
            const verificationCode = await fetchPromise;
            resolve(verificationCode);
          } catch (err) {
            reject(err);
          }
        });
      });
    });

    imap.once("error", (err) => {
      reject(err);
    });

    imap.connect();
  });
}
module.exports = {
  fetchVerificationCodeFromEmail,
};
