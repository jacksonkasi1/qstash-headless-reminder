const logger = require("../utils/logger");

const reminderService = require("../services/reminderService");
const qstashService = require("../services/qstashService");

exports.refreshReminders = async (req, res) => {
  try {
    await reminderService.setupReminders();
    res.send({ success: true, message: "Reminders refreshed" });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error refreshing reminders" });
  }
};

exports.addReminder = async (req, res) => {
  try {
    // const body = {
    //   patientName: "Jackson Kasi",
    //   hospitalName: "City Hospital",
    //   patientId: "12345",
    //   type: "Daily",
    //   date: "2024-01-17",
    //   time: "08:00",
    //   repeatFrequency: "Every Day",
    //   repeatDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    //   uid: "Ozwx7RXcTCLoz3W4kMAt"
    // };

    const reminderId = await reminderService.addReminder(req.body);

    const cornResult = await qstashService.setCronTrigger({
      ...req.body,
      reminderId: reminderId,
    });

    logger.info(`Cron result: ${cornResult}`);

    res
      .status(201)
      .json({ success: true, message: "Reminder added", id: reminderId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReminders = async (req, res) => {
  try {
    const reminders = await reminderService.fetchReminders();
    res.json(reminders);
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.updateReminder = async (req, res) => {
  try {
    await reminderService.updateReminder(req.params.id, req.body);
    res.send({ success: true, message: "Reminder updated" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    await reminderService.deleteReminder(req.params.id);
    res.send({ success: true, message: "Reminder deleted" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.sendReminders = async (req, res) => {
  try {
    await reminderService.sendNotificationToUser(req.body);
    res.send({ success: true, message: "Reminders sent" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};