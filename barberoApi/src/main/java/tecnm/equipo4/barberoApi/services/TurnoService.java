package tecnm.equipo4.barberoApi.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tecnm.equipo4.barberoApi.models.Turno;
import tecnm.equipo4.barberoApi.repositories.TurnoRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TurnoService {

    private final TurnoRepository turnoRepository;

    public List<Turno> listarTodos() {
        return turnoRepository.findAll();
    }

    public Optional<Turno> buscarPorId(Long idTurno) {
        return turnoRepository.findById(idTurno);
    }

    public List<Turno> listarPorFecha(LocalDate fecha) {
        return turnoRepository.findByFecha(fecha);
    }

    public List<Turno> listarPorEstado(String estado) {
        return turnoRepository.findByEstado(estado);
    }

    public Turno agendar(Turno turno) {
        if (turno.getEstado() == null || turno.getEstado().isBlank()) {
            turno.setEstado("PENDIENTE");
        }
        return turnoRepository.save(turno);
    }

    public Optional<Turno> cambiarEstado(Long idTurno, String nuevoEstado) {
        return turnoRepository.findById(idTurno).map(t -> {
            t.setEstado(nuevoEstado);
            return turnoRepository.save(t);
        });
    }

    public void eliminar(Long idTurno) {
        turnoRepository.deleteById(idTurno);
    }
}