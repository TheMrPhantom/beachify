import schedule
import time
import threading


class TaskScheduler:
    def __init__(self,app) -> None:
        self.app=app
        return

    def start(self) -> None:
        threading.Thread(target=self.loop).start()

    def loop(self) -> None:
        while True:
            try:
                with self.app.app_context():
                    time.sleep(1)
                    schedule.run_pending()
            except Exception as e:
                print("Error in TaskScheduler loop:", e)

    def add_Daily_Task(self, task, *args) -> None:
        if len(args) > 0:
            schedule.every().day.at("00:01").do(task, args)
        else:
            schedule.every().day.at("00:01").do(task)

    def add_minutely_task(self, task, *args) -> None:
        if len(args) > 0:
            schedule.every().minute.at(":01").do(task, args)
        else:
            schedule.every().minute.at(":01").do(task)

    def add_secondly_task(self, task, *args) -> None:
        if len(args) > 0:
            schedule.every(5).seconds.do(task, args)
        else:
            schedule.every(5).seconds.do(task)
