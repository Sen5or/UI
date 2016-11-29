import IdentificationServiceHttpClientHelper
import threading
import time
import sys


class identify_thread (threading.Thread):
    def __init__(self, path):
        threading.Thread.__init__(self)
        self.path = path
        self.exec = True
        self.profile_ids = ["99ef319e-a9a5-4a46-b679-cf2e7e4ca5f7", "de762baa-703c-4083-8595-000c3b389cb5", "3c5ef345-39ee-41bc-a5fb-63154a5b8f1e", "33ab384c-029f-4dad-8249-9a863e85e04c"]
        subscription_key = '136e62d920fc4696a91c1dbbf32d9a31'
        self.force_short_audio = 'true'
        self.helper = IdentificationServiceHttpClientHelper.IdentificationServiceHttpClientHelper(subscription_key)
    def run(self):
        while self.exec:
            identification_response = self.helper.identify_file(
                self.path, self.profile_ids,
                self.force_short_audio.lower() == "true")
            if (identification_response.get_identified_profile_id() == "99ef319e-a9a5-4a46-b679-cf2e7e4ca5f7"):
                print('Frank')
            elif (identification_response.get_identified_profile_id() == "33ab384c-029f-4dad-8249-9a863e85e04c"):
                print('YiDan')
            elif (identification_response.get_identified_profile_id() == "3c5ef345-39ee-41bc-a5fb-63154a5b8f1e"):
                print('Dhanesh')
            else:
                print('Cannot Identify Speaker')
            time.sleep(5)
    def terminate(self):
        self.exec = False
        print('Terminated!')

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print('Usage: python3 IdentifyFile.py <identification_file_path>')
        sys.exit('Error: Incorrect Usage.')
    thread0 = identify_thread(sys.argv[1])
    thread0.start()
    s = ""
    while (s != "E"):
        s = input("Identification is running. Input E to exit.\n")
    thread0.terminate();
    # thread.start_new_thread(identify_file, (sys.argv[1]));
    # identify_file(sys.argv[1])
