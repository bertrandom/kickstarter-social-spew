# kickstarter-social-spew

Scrapes Kickstarter for new projects that Bert's friends have backed and sends them to a Slack channel. 

Keeps a record of projects that have already been sent.

### config

Copy `config/default.json` to `config/local.json` and fill in the credentials. Create `config/local-production.json` with production credentials.

### usage

```
node index
```

In production:

```
export NODE_ENV=production; node index
```

### crontab

Every five minutes:

```
*/5 * * * * cd /var/www/kickstarter-social-spew && export NODE_ENV=production; node index > /dev/null 2>&1
```

### misc

```
rsync -av --filter=':- .gitignore' --exclude=.git ./ bertrand@server.bertrandom.com:/var/www/kickstarter-social-spew
```