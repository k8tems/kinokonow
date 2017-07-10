set -eo pipefail

CONCURRENCY=1
fab -H ${DEST_HOST} deploy:listener,${DEST_DIR},"celery -A tasks.celery worker -l INFO -c ${CONCURRENCY}"