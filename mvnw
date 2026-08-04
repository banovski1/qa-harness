#!/bin/sh
# ----------------------------------------------------------------------------
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#    https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
# ----------------------------------------------------------------------------

# ----------------------------------------------------------------------------
# Apache Maven Wrapper startup script — version 3.3.2
#
# Automatically downloads Maven on first run. Java 17+ must be available.
# On macOS, uses /usr/libexec/java_home. On Linux, searches PATH and SDKMAN.
# ----------------------------------------------------------------------------

if [ -z "$MAVEN_SKIP_RC" ] ; then
  if [ -f /usr/local/etc/mavenrc ] ; then . /usr/local/etc/mavenrc ; fi
  if [ -f /etc/mavenrc ]           ; then . /etc/mavenrc           ; fi
  if [ -f "$HOME/.mavenrc" ]       ; then . "$HOME/.mavenrc"       ; fi
fi

# OS detection
cygwin=false
darwin=false
mingw=false
case "$(uname)" in
  CYGWIN*) cygwin=true ;;
  MINGW*)  mingw=true  ;;
  Darwin*)
    darwin=true
    if [ -z "$JAVA_HOME" ] && [ -x "/usr/libexec/java_home" ]; then
      JAVA_HOME="$(/usr/libexec/java_home)"
      export JAVA_HOME
    fi
    ;;
esac

# Gentoo
if [ -z "$JAVA_HOME" ] && [ -r /etc/gentoo-release ]; then
  JAVA_HOME=$(java-config --jre-home)
fi

# SDKMAN (Linux / macOS)
if [ -z "$JAVA_HOME" ] && [ -s "$HOME/.sdkman/candidates/java/current" ]; then
  JAVA_HOME="$HOME/.sdkman/candidates/java/current"
  export JAVA_HOME
fi

# jenv (macOS / Linux)
if [ -z "$JAVA_HOME" ] && command -v jenv >/dev/null 2>&1; then
  JAVA_HOME="$(jenv prefix)"
  export JAVA_HOME
fi

# Cygwin path conversion
if $cygwin ; then
  [ -n "$JAVA_HOME" ]  && JAVA_HOME=$(cygpath --unix "$JAVA_HOME")
  [ -n "$CLASSPATH" ]  && CLASSPATH=$(cygpath --path --unix "$CLASSPATH")
fi

# Mingw path normalisation
if $mingw ; then
  [ -n "$JAVA_HOME" ] && JAVA_HOME="$(cd "$JAVA_HOME"; pwd)"
fi

# Derive JAVA_HOME from javac in PATH
if [ -z "$JAVA_HOME" ]; then
  javaExecutable="$(command -v javac 2>/dev/null)"
  if [ -n "$javaExecutable" ]; then
    readLink=$(command -v readlink 2>/dev/null)
    if [ -n "$readLink" ]; then
      if $darwin; then
        javaHome="$(dirname "$javaExecutable")"
        javaExecutable="$(cd "$javaHome" && pwd -P)/javac"
      else
        javaExecutable="$(readlink -f "$javaExecutable")"
      fi
      javaHome="$(dirname "$javaExecutable")"
      JAVA_HOME="$(expr "$javaHome" : '\(.*\)/bin')"
      export JAVA_HOME
    fi
  fi
fi

if [ -z "$JAVACMD" ]; then
  if [ -n "$JAVA_HOME" ]; then
    JAVACMD="$JAVA_HOME/bin/java"
  else
    JAVACMD="$(command -v java)"
  fi
fi

if [ ! -x "$JAVACMD" ]; then
  echo "Error: JAVA_HOME is not defined correctly." >&2
  echo "  Cannot execute: $JAVACMD" >&2
  echo "" >&2
  echo "  Install Java 17+ and set JAVA_HOME, or open the project in IntelliJ IDEA" >&2
  echo "  which provides its own bundled JDK." >&2
  exit 1
fi

[ -z "$JAVA_HOME" ] && echo "Warning: JAVA_HOME is not set."

# Locate .mvn directory
findDir() {
  path="$1"
  while [ "$path" != "" ]; do
    if [ -d "$path/$2" ]; then
      realpath "$path" 2>/dev/null || echo "$path"
      return
    fi
    path="$(dirname "$path")"
  done
}

MAVEN_PROJECTBASEDIR="$(findDir "$(pwd)" .mvn)"
WRAPPER_DIR="$MAVEN_PROJECTBASEDIR/.mvn/wrapper"
WRAPPER_JAR="$WRAPPER_DIR/maven-wrapper.jar"
WRAPPER_PROPERTIES="$WRAPPER_DIR/maven-wrapper.properties"
WRAPPER_LAUNCHER="org.apache.maven.wrapper.MavenWrapperMain"

# Download wrapper jar if missing
if [ ! -f "$WRAPPER_JAR" ]; then
  DOWNLOAD_URL=$(grep -E "^wrapperUrl=" "$WRAPPER_PROPERTIES" | sed -e 's/wrapperUrl=//')
  echo "Downloading Maven Wrapper from: $DOWNLOAD_URL"
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL -o "$WRAPPER_JAR" "$DOWNLOAD_URL" || {
      echo "Error: Failed to download Maven Wrapper jar." >&2; exit 1
    }
  elif command -v wget >/dev/null 2>&1; then
    wget -q -O "$WRAPPER_JAR" "$DOWNLOAD_URL" || {
      echo "Error: Failed to download Maven Wrapper jar." >&2; exit 1
    }
  else
    echo "Error: Neither curl nor wget found. Cannot download Maven Wrapper." >&2
    exit 1
  fi
fi

# Cygwin classpath conversion
WRAPPER_JAR_PATH="$WRAPPER_JAR"
if $cygwin; then
  WRAPPER_JAR_PATH=$(cygpath --path --windows "$WRAPPER_JAR")
  MAVEN_PROJECTBASEDIR=$(cygpath --path --windows "$MAVEN_PROJECTBASEDIR")
fi

exec "$JAVACMD" \
  $MAVEN_OPTS \
  $MAVEN_DEBUG_OPTS \
  -classpath "$WRAPPER_JAR_PATH" \
  "-Dmaven.multiModuleProjectDirectory=$MAVEN_PROJECTBASEDIR" \
  $WRAPPER_LAUNCHER "$@"
