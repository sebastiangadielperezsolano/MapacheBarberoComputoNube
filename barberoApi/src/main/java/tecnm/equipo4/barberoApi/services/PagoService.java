package tecnm.equipo4.barberoApi.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tecnm.equipo4.barberoApi.models.Pago;
import tecnm.equipo4.barberoApi.repositories.PagoRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PagoService {

    private final PagoRepository pagoRepository;

    public List<Pago> listarTodos() {
        return pagoRepository.findAll();
    }

    public Optional<Pago> buscarPorId(Long idPago) {
        return pagoRepository.findById(idPago);
    }

    public List<Pago> listarPorEstado(String estado) {
        return pagoRepository.findByEstado(estado);
    }

    public Pago registrarPago(Pago pago) {
        return pagoRepository.save(pago);
    }

    public Optional<Pago> actualizarEstado(Long idPago, String nuevoEstado) {
        return pagoRepository.findById(idPago).map(p -> {
            p.setEstado(nuevoEstado);
            return pagoRepository.save(p);
        });
    }
}