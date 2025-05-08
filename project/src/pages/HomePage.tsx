import React from 'react';
import { Link } from 'react-router-dom';
import { usePageView } from '../hooks/useTracking';
import { ArrowRight } from 'lucide-react';

export function HomePage() {
  usePageView('home');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Willkommen im KL Software Center
        </h1>
        <p className="text-xl text-gray-600">
          Ihre zentrale Anlaufstelle für Software und Tutorials an der Karl Landsteiner Privatuniversität
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4">Software & Apps</h2>
          <p className="text-gray-600 mb-6">
             Geprüfte Software, die gezielt auf die Anforderungen unserer Mitarbeitenden abgestimmt ist.
          </p>
          <Link 
            to="/apps" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            Zu den Apps
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4">Tutorials & Anleitungen</h2>
          <p className="text-gray-600 mb-6">
            Finden Sie hilfreiche Anleitungen zur Nutzung der verschiedenen Programme.
          </p>
          <Link 
            to="/tutorials" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            Zu den Tutorials
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold mb-4">Neu hier?</h2>
        <p className="text-gray-700 mb-4">
          Das KL Software Center bietet Ihnen:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
          <li>Einfachen Zugriff auf wichtige Software-Anwendungen</li>
          <li>Detaillierte Installationsanleitungen</li>
          <li>Regelmäßige Updates und neue Inhalte</li>
        </ul>
        <p className="text-gray-700">
          Bei Fragen oder Problemen wenden Sie sich bitte an den IT-Support unter:
          <br></br>
          <br></br>
          Tel: +43 2732 7290220
          <br></br>
          Email: edv-hotline@kl.ac.at
        </p>
      </div>
    </div>
  );
}