all:
	@echo "Starting both..."
	( make backend & make frontend )


backend:
	@echo "Starting backend..."
	cd backend && npm install && nohup npm run dev > ../backend.log 2>&1 & echo $$! > ../backend.pid

frontend:
	@echo "Starting frontend..."
	cd frontend && npm install && nohup npm run dev > ../frontend.log 2>&1 & echo $$! > ../frontend.pid

down:
	@echo "Stopping backend and frontend..."
	@ps aux | grep '[t]s-node-dev' | awk '{print $$2}' | xargs -r kill
	@ps aux | grep '[v]ite' | awk '{print $$2}' | xargs -r kill
	@ps aux | grep '[e]sbuild' | awk '{print $$2}' | xargs -r kill

fclean: down
	rm -rf backend/node_modules
	rm -rf frontend/node_modules

.PHONY: all backend frontend down fclean
