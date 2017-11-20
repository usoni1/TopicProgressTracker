import pandas
import codecs
from random import randint
from random import sample
import numpy as np
import json

def create_doc(username, max_number_of_sessions, course_topics):
    doc = {}
    doc["username"] = username
    doc["user_sessions"] = []
    user_number_of_sessions = randint(0, max_number_of_sessions)
    for session in range(user_number_of_sessions):
        user_number_of_topics_covered = min(len(course_topics), max([1, np.random.poisson(2.5)])) #number of topics usually covered in one session are assumed 2
        session_topics = sample(list(course_topics), user_number_of_topics_covered)
        t1 = []
        for topic in session_topics:
            session_info = {}
            session_info["topic_name"] = topic
            session_info["number_of_questions"] = randint(1, course_topics[topic])
            t1.append(session_info)
        doc["user_sessions"].append(t1)
    return doc


if __name__ == "__main__":
    course_topics = {}
    topic_list = []
    with codecs.open('Java__Quiz_Questions.csv', "r", encoding='utf-8', errors='ignore') as fdata:
        csv = pandas.read_csv(fdata)
        for idx, row in csv.iterrows():
            if row["courseTopic"] in course_topics:
                course_topics[row["courseTopic"]] += 1
            else:
                course_topics[row["courseTopic"]] = 1
                topic_list.append(row["courseTopic"])

    number_of_users = 50
    max_number_of_sessions = 30
    total_number_of_topics = len(course_topics)

    f = open('topic_list.js', 'w')
    json.dump(topic_list, f, indent=4, separators=(',', ":"))
    f.close()

    all_docs = []
    for i in range(number_of_users):
        all_docs.append(create_doc('user' + str(i + 1), max_number_of_sessions, course_topics))

    f = open('user_session_history.js', 'w')
    json.dump(all_docs, f, indent=4, separators=(',', ':'))
    f.close()

