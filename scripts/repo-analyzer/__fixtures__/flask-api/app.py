@app.get("/api/health")
def health(): return "ok"

@app.route("/api/items", methods=["GET", "POST"])
def items(): return []
